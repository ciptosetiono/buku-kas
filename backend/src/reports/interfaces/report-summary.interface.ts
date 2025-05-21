import { AccountSummary } from './account-summary.interface';

export interface ReportSummary {
    totalIncome: number;
    totalExpense: number;
    netTotal: number;
    accounts: AccountSummary[];
}