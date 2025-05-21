import React from 'react';
import { formatRupiah } from '@/utils/format';
import { CategoryBreakdownInterface } from './CategoryBreakdwonInterface';

export default function CategoryBreakdownTable({ type, categories } : { type: string, categories: CategoryBreakdownInterface[]}) {

    // Calculate the total amount based on type
    const totalAmount = categories.reduce((sum, c) => {
        return sum + (type === 'income' ? c.totalIncome : c.totalExpense);
    }, 0);

    return (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
            <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Amount</th>
            </tr>
            </thead>
            <tbody>
            {categories.length === 0 && (
                <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                    No data available
                </td>
                </tr>
            )}
            {categories
            .filter(cat => {
                return type === 'income' ? cat.totalIncome > 0 : cat.totalExpense > 0;
            })
            .map(({ categoryId, categoryName, totalIncome, totalExpense }) => (
                <tr key={categoryId} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{categoryName}</td>
                <td className="py-2 px-4 border-b text-right">
                    {type === 'income'
                    ? formatRupiah(totalIncome)
                    :formatRupiah(totalExpense)}
                </td>
                </tr>
            ))}
            <tr className="font-semibold bg-gray-50">
              <td className="py-2 px-4 border-t">Total</td>
              <td className="py-2 px-4 border-t text-right">
                {totalAmount.toLocaleString()}
              </td>
            </tr>
            </tbody>
        </table>
    );
}
