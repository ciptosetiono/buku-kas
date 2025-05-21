import { Category } from "../categories/CategoryInterface";
import Account from "../accounts/accountInterface";
import { User } from "../users/UserInterface";

export enum TransactionType  {
    Income = 'income',
    Expense = 'expense'
}

export type Transaction = {
    _id: string;
    user: User;
    account: Account;
    category: Category;
    type: TransactionType;
    amount: number;
    date: string;
    note?: string;
};