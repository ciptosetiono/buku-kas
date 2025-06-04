
import React from "react";
import { MonthlyTrendInterface } from "./MontlyTrendInterface";
import { monthNames } from "@/utils/constants";

export default function MonthlyTrendTable({ trends }: { trends: MonthlyTrendInterface[] }){
  // You may need to define monthNames if not already defined

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-gray-700 dark:text-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Month</th>
            <th className="px-4 py-2 text-right">Start Balance</th>
            <th className="px-4 py-2 text-right">Income</th>
            <th className="px-4 py-2 text-right">Expense</th>
            <th className="px-4 py-2 text-right">End Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800 dark:text-gray-200">
          {trends.map((t, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2">
                {monthNames[t.month]} {t.year}
              </td>
              <td className="px-4 py-2 text-right">
                {t.startBalance.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                {t.totalIncome.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right">
                {t.totalExpense.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right font-medium">
                {t.currentBalance.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}