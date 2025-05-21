import Account from "../accounts/accountInterface";
import { User } from "../users/UserInterface";

export type Transfer= {
    _id: string;
    user: User;
    fromAccount: Account;
    toAccount: Account;
    amount: number;
    date: string;
    note?: string;
};