import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@/components/data-table';
import { formatRupiah } from '@/utils/format';
import { AccountReport } from '../ReportInterface';


export type totalAccount = {
    startBalance: number,
    income: number,
    expense: number,
    different: number,
    currentBalance: number
}

export function countTotalAllAccount(accounts: AccountReport[]) : totalAccount {
    const startBalance = accounts.reduce((sum, acc) => sum + acc.startBalance, 0);
    const income = accounts.reduce((sum, acc) => sum + acc.totalIncome, 0);
    const expense = accounts.reduce((sum, acc) => sum + acc.totalExpense, 0);
    const different = income - expense;
    const currentBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

    return {
        startBalance,
        income,
        different,
        expense,
        currentBalance
    };
}

export default function AccountSummaryTable({ accounts }: { accounts: AccountReport[] }) {

    const totalAllAccount: totalAccount = countTotalAllAccount(accounts);

    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Account Summary</h2>
            <Table>
                <TableHeader>
                    <TableRowHeader>
                        <TableCell isHeader>Account</TableCell>
                        <TableCell isHeader>Start Balance</TableCell>
                        <TableCell isHeader>Total Income</TableCell>
                        <TableCell isHeader>Total Expense</TableCell>
                        <TableCell isHeader>Different</TableCell>
                        <TableCell isHeader>Current Balance</TableCell>
                    </TableRowHeader>
                </TableHeader>
                <TableBody>
                    {accounts.map((account) => (
                        <TableRow key={account._id}>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{formatRupiah(account.startBalance)}</TableCell>
                            <TableCell className="text-green-600">{formatRupiah(account.totalIncome)}</TableCell>
                            <TableCell className="text-red-600">{formatRupiah(account.totalExpense)}</TableCell>
                            <TableCell className={account.totalIncome - account.totalExpense >= 0 ? "text-green-600" : "text-red-600"}>
                                {formatRupiah(account.totalIncome - account.totalExpense)}
                            </TableCell>
                            <TableCell className="font-semibold">{formatRupiah(account.currentBalance)}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow key="accounts-summary">
                        <TableCell isHeader className="font-bold">Total</TableCell>
                        <TableCell isHeader className="font-bold">{formatRupiah(totalAllAccount.startBalance)}</TableCell>
                        <TableCell isHeader className="font-bold text-green-600">{formatRupiah(totalAllAccount.income)}</TableCell>
                        <TableCell isHeader className="font-bold text-red-600">{formatRupiah(totalAllAccount.expense)}</TableCell>
                        <TableCell isHeader className={`font-bold ${totalAllAccount.different >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatRupiah(totalAllAccount.different)}
                        </TableCell>
                        <TableCell className="font-bold">{formatRupiah(totalAllAccount.currentBalance)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}

