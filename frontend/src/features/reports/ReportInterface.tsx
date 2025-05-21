import { Category } from '@/features/categories/CategoryInterface';
import Account from '../accounts/accountInterface';
export type AccountReport = {
  _id: string;
  name: string;
  startBalance: number;
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
};

export type TransactionReport = {
  _id: string;
  date: string;
  note: string;
  type: string;
  category: Category;
  account: Account;
  amount: number;
  balance: number;
};

export type CashbookReportType = {
  startBalance: number;
  currentBalance: number;
  accounts: AccountReport[];
  transactions: TransactionReport[];
};