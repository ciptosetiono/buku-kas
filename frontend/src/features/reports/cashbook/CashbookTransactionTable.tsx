import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableRowHeader,
} from '@/components/data-table';

import { TransactionReport } from '../ReportInterface';
import { TransactionType } from '@/features/transactions/TransactionInterface';
import { formatRupiah, formatTanggal } from '@/utils/format';
export function CashbookRow({ transaction }: { transaction: TransactionReport }) {
  const cellClass = transaction.type === 'income' ? 'text-green-600' : 'text-red-600';

  return (
    <TableRow key={transaction._id} className="text-center">
       <TableCell className={cellClass}>{transaction.account?.name}</TableCell>
      <TableCell className={cellClass}>{transaction.category?.name}</TableCell>
      <TableCell className={cellClass}>{formatTanggal(transaction.date)}</TableCell>
      <TableCell className={cellClass}>{transaction.note}</TableCell>
      <TableCell className={cellClass}>
        {transaction.type === TransactionType.Expense && formatRupiah(transaction.amount)}
      </TableCell>
      <TableCell className={cellClass}>
        {transaction.type === TransactionType.Income && formatRupiah(transaction.amount)}
      </TableCell>
      <TableCell className="font-semibold">{formatRupiah(transaction.balance)}</TableCell>
    </TableRow>
  );
}

export default function CashbookTransactionTable({ transactions } : { transactions: TransactionReport[]}) {
    return(
        <div className="mt-10">
            <h2 className="text-lg font-semibold mb-2">Detail Transactions</h2>
            <Table>
              <TableHeader>
                <TableRowHeader>
                  <TableCell isHeader>Account</TableCell>
                  <TableCell isHeader>Category</TableCell>
                  <TableCell isHeader>Date</TableCell>
                  <TableCell isHeader>Note</TableCell>
                  <TableCell isHeader>Expense</TableCell>
                  <TableCell isHeader>Income</TableCell>
                  <TableCell isHeader>Saldo</TableCell>
                </TableRowHeader>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <CashbookRow key={transaction._id} transaction={transaction} />
                ))}
              </TableBody>
            </Table>
          </div>
    )
}