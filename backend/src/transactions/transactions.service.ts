import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from "mongoose";
import { Transaction } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { SearchTransactionDto } from './dto/search-transaction.dto';
import { Account, AccountDocument } from '../accounts/schemas/account.schema';
import {Category, CategoryDocument }from '../categories/schemas/category.schema';
import { PaginationDto } from 'src/common/dto/pagination-dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private model: Model<Transaction>,
    @InjectModel(Account.name) private readonly accountModel: Model<AccountDocument>,
    @InjectModel(Category.name) private readonly categorytModel: Model<CategoryDocument>,
  ) {}

  async create(userId: string, dto: CreateTransactionDto) {

    //validate accountId
    if (!isValidObjectId(dto.account)) {
      throw new BadRequestException('Invalid account ID format');
    }

    //find account
    const account = await this.accountModel.findOne({_id: dto.account});
    if (!account) throw new NotFoundException('Account not found');

    //find category = 
    const category = await  this.categorytModel.findOne({_id: dto.category});
    
    const amount = dto.amount;

    if (dto.type === 'income') {
      account.balance += amount;
    } else if (dto.type === 'expense') {
      account.balance -= amount;
    } else {
      throw new BadRequestException('Invalid transaction type');
    }

    await account.save();

    const transaction = new this.model({ ...dto, category: category?._id, user: userId });

    return transaction.save();
  }

  async update(id: string, userId: string, dto: UpdateTransactionDto) {

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid trasaction ID format');
    }

    const trx = await this.model.findOne({ _id: id });
    if (!trx) throw new NotFoundException('Transaction not found');

    // Find related account
    const oldAccount = await this.accountModel.findById(trx.account);

    if (!oldAccount) throw new NotFoundException('Old account not found');

    const newAccount = dto.account
      ? await this.accountModel.findOne({ _id: dto.account})
      : oldAccount;

    if (!newAccount) throw new NotFoundException('Account not found');

    // Revert previous balance
    if (trx.type === 'income') {
      oldAccount.balance -= trx.amount;
    } else if (trx.type === 'expense') {
      oldAccount.balance += trx.amount;
    }
    await oldAccount.save();

    // Apply new balance
    const updatedType = dto.type || trx.type;
    const updatedAmount = dto.amount ?? trx.amount;

    if (updatedType === 'income') {
      newAccount.balance += updatedAmount;
    } else if (updatedType === 'expense') {
      newAccount.balance -= updatedAmount;
    }

    await newAccount.save();

    // Update transaction
    const updated = await this.model.findOneAndUpdate(
      { _id: id},
      dto,
      { new: true },
    );

    return updated;
  }

  async findOne(id: string) {
    //validate id
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid trasaction ID format');
    }
          
    const transaction = await this.model.findOne({ _id: id});
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async findAll(searchDto: SearchTransactionDto, paginationDto: PaginationDto) {
    const filter: Record<string, any> = {};

    const {  page = 1, limit = 10 } = paginationDto;

    const skip = (Number(page) - 1) * Number(limit);

    Object.entries(searchDto).forEach(([key, value]) => {
      if (value) {
        if (key === 'fromDate' || key === 'toDate') {
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime())) {
            filter.date = filter.date || {};
            if (key === 'toDate') {
              // Set time to end of day to include all results on that date
              dateValue.setHours(23, 59, 59, 999);
              filter.date['$lte'] = dateValue;
            } else {
              // fromDate: beginning of the day (default)
              dateValue.setHours(0, 0, 0, 0);
              filter.date['$gte'] = dateValue;
            }
          }
      } else {
         filter[key] = value;
        }
      }
    });

    const [ transactions, total ] = await Promise.all([
      this.model.find(filter).sort({date: -1, _id: -1}).skip(skip).limit(limit).populate('account', 'name').populate('category', 'name'),
      this.model.countDocuments(filter),
    ]);

    return {
      data: transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid trasaction ID format');
    }

    const trx = await this.model.findOne({ _id: id});
    if (!trx) throw new NotFoundException('Transaction not found');

    const account = await this.accountModel.findById(trx.account);
    if (!account) throw new NotFoundException('Account not found');

    // Revert balance
    if (trx.type === 'income') {
      account.balance -= trx.amount;
    } else if (trx.type === 'expense') {
      account.balance += trx.amount;
    }

    await account.save();

    const deleted = await this.model.findOneAndDelete({ _id: id});

    if(!deleted) {
      throw new NotFoundException('Transaction not found');
    }
    return { message: 'Transaction deleted successfully' };
  }
}
