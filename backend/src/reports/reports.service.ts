import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument, TransactionType } from '../transactions/schemas/transaction.schema';
import { Account, AccountDocument } from '../accounts/schemas/account.schema';

@Injectable()
export class ReportsService {
  private readonly defaultStartDate = new Date('2000-01-01');
  private readonly defaultEndDate = new Date();

  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,

    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async getCashbookReport(fromDate: Date, toDate: Date, account?: string) {
    const startBalances = await this.getStartBalances(fromDate, account);
    const transactions = await this.getTransactions(fromDate, toDate, account);
    const enrichedTransactions = this.calculateRunningBalances(transactions, startBalances);

    const accounts = await this.getAccounts(account);
    const summary = this.buildSummary(enrichedTransactions, startBalances, accounts);

    return {
      ...summary,
      transactions: enrichedTransactions,
    };
  }

 async getMonthlyTrend(months = 12, from?: Date, to?: Date, account?: string) {
  const endDate = to ?? this.defaultEndDate;
  const startDate = from ?? new Date(new Date(endDate).setMonth(endDate.getMonth() - months + 1));

  const accountFilter: any = {};
  if (account && Types.ObjectId.isValid(account)) {
    accountFilter.account = account;
  }

  const startAgg = await this.transactionModel.aggregate([
    { $match: { date: { $lt: startDate }, ...accountFilter } },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);

  const incomeBefore = startAgg.find(a => a._id === 'income')?.total || 0;
  const expenseBefore = startAgg.find(a => a._id === 'expense')?.total || 0;
  let runningBalance = incomeBefore - expenseBefore;

  const trend = await this.transactionModel.aggregate([
    { $match: { date: { $gte: startDate, $lte: endDate }, ...accountFilter } },
    {
      $project: {
        year: { $year: '$date' },
        month: { $month: '$date' },
        type: '$type',
        amount: '$amount',
      },
    },
    {
      $group: {
        _id: { year: '$year', month: '$month', type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    {
      $group: {
        _id: { year: '$_id.year', month: '$_id.month' },
        totalIncome: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0] },
        },
        totalExpense: {
          $sum: { $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0] },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        totalIncome: 1,
        totalExpense: 1,
      },
    },
  ]);

  const trendWithBalances = trend.map(month => {
    const startBalance = runningBalance;
    runningBalance += month.totalIncome - month.totalExpense;

    return {
      ...month,
      startBalance,
      currentBalance: runningBalance,
    };
  });

  return {
    startBalance: incomeBefore - expenseBefore,
    trends: trendWithBalances,
  };
}

async getCategoryBreakdown(from?: Date, to?: Date, account?: string, type?: string) {
  const start = from ?? this.defaultStartDate;
  const end = to ?? this.defaultEndDate;

  // Build match filter for date range, add account if provided
  const matchFilter: any = { date: { $gte: start, $lte: end } };
  if (account && Types.ObjectId.isValid(account)) {
    matchFilter.account = account;
  }

  //type filter
  if (type) {
     matchFilter.type = type;
  }

  // Aggregate transactions by category and type
  const breakdown = await this.transactionModel.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: { category: '$category', type: '$type' },
        total: { $sum: '$amount' },
      },
    },
    {
      $lookup: {
        from: 'categories', // Adjust if your collection name differs
        localField: '_id.category',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryId: '$_id.category',
        categoryName: '$category.name',
        type: '$_id.type',
        total: 1,
      },
    },
    {
      $group: {
        _id: '$categoryId',
        categoryName: { $first: '$categoryName' },
        income: {
          $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$total', 0] },
        },
        expense: {
          $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$total', 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        categoryId: '$_id',
        categoryName: 1,
        totalIncome: '$income',
        totalExpense: '$expense',
      },
    },
  ]);

  return { categories: breakdown };
}


  private async getStartBalances(fromDate: Date, account?: string) {
    const match: any = { date: { $lt: new Date(fromDate) } };

    if (account && Types.ObjectId.isValid(account)) {
      match.account = account;
    }

    const agg = await this.transactionModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: { account: '$account', type: '$type' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const accountStartBalances: Record<string, number> = {};
    let startBalance = 0;

    for (const { _id, total } of agg) {
      const accountId = _id.account?.toString?.() ?? '';
      if (!accountId) continue;

      if (!accountStartBalances[accountId]) accountStartBalances[accountId] = 0;

      if (_id.type === 'income') {
        accountStartBalances[accountId] += total;
        startBalance += total;
      } else if (_id.type === 'expense') {
        accountStartBalances[accountId] -= total;
        startBalance -= total;
      }
    }

    return { startBalance, accountStartBalances };
  }

  private async getTransactions(fromDate: Date, toDate: Date, account?: string) {
    const filter: any = { date: { $gte: fromDate, $lte: toDate } };

    if (account && Types.ObjectId.isValid(account)) {
      filter.account = account;
    }

    return this.transactionModel
      .find(filter)
      .populate('account', 'name')
      .populate('category', 'name')
      .sort({ date: 1 })
      .lean();
  }

  private calculateRunningBalances(transactions, startBalances: { startBalance: number; accountStartBalances: Record<string, number> }) {
    let currentBalance = startBalances.startBalance;
    const accountBalances: Record<string, number> = { ...startBalances.accountStartBalances };

    return transactions.map((t) => {
      const accountId = t.account._id.toString();
      if (!accountBalances[accountId]) accountBalances[accountId] = 0;

      if (t.type === 'income') {
        currentBalance += t.amount;
        accountBalances[accountId] += t.amount;
      } else {
        currentBalance -= t.amount;
        accountBalances[accountId] -= t.amount;
      }

      return {
        ...t,
        balance: currentBalance,
        accountBalance: accountBalances[accountId],
      };
    });
  }

  private buildSummary(
    transactions,
    startBalances: { startBalance: number; accountStartBalances: Record<string, number> },
    allAccounts: { _id: any; name: string }[]
  ) {
    let totalIncome = 0;
    let totalExpense = 0;
    let currentBalance = startBalances.startBalance;
    const accountMap = new Map<string, any>();

    // Inisialisasi semua akun
    for (const acc of allAccounts) {
      const id = acc._id.toString();
      accountMap.set(id, {
        _id: id,
        name: acc.name,
        startBalance: startBalances.accountStartBalances[id] || 0,
        totalIncome: 0,
        totalExpense: 0,
        currentBalance: startBalances.accountStartBalances[id] || 0,
      });
    }

    for (const t of transactions) {
      const accountId = t.account?._id?.toString?.();
      if (!accountId) continue;

      const acc = accountMap.get(accountId);
      if (!acc) continue;

      if (t.type === 'income') {
        totalIncome += t.amount;
        currentBalance += t.amount;
        acc.totalIncome += t.amount;
        acc.currentBalance += t.amount;
      } else {
        totalExpense += t.amount;
        currentBalance -= t.amount;
        acc.totalExpense += t.amount;
        acc.currentBalance -= t.amount;
      }
    }

    return {
      startBalance: startBalances.startBalance,
      totalIncome,
      totalExpense,
      currentBalance,
      accounts: Array.from(accountMap.values()),
    };
  }

  private async getAccounts(accountId ? : string) {

    const accountFilter: any = {};
    if (accountId && Types.ObjectId.isValid(accountId)) {
      accountFilter._id = accountId;
    }    
    return this.accountModel.find(accountFilter, '_id name').lean(); // ambil id dan name saja
  }

  parseDateQuery(from?: Date, to?: Date) {
    const fromDate = new Date(from ?? this.defaultStartDate);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(to ?? this.defaultEndDate);
    toDate.setHours(23, 59, 59, 999);
    return { fromDate, toDate };
  }
}