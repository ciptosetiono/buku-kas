"use client";

import React from 'react';

import  { Transaction } from './TransactionInterface';
import {Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow, } from '@/components/data-table';
import ActionButton from '@/components/data-table/ActionButton';
import Pagination, { PaginationProps } from '@/components/data-table/Pagination';
import DataSummary from '@/components/data-table/DataSummary';
import { formatTanggal, formatRupiah } from '@/utils/format';

export type TransactionRowProps = {
    transaction: Transaction,
    onDetail: (transaction: Transaction) => void,
    onEdit: (transaction: Transaction) => void,
    onDelete: (transaction: Transaction) => void
}

export const TransactionRow = ({transaction, onDetail, onEdit, onDelete} : TransactionRowProps) => {
  const cellClass =
  transaction.type === 'income'
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';

    return (
        <TableRow key={transaction._id}>
            <TableCell   className={cellClass}>
                {transaction.account.name}
            </TableCell>
            <TableCell   className={cellClass}>
                {transaction.type}
            </TableCell>
            <TableCell   className={cellClass}>
                {transaction.category.name}
            </TableCell>
            <TableCell className={cellClass}>
                {transaction.note}
            </TableCell>
            <TableCell  className={cellClass}>
              { formatTanggal(transaction.date) }
            </TableCell>
            <TableCell className={cellClass}>
              {formatRupiah(transaction.amount)}
            </TableCell>
            <TableCell>
              <ActionButton 
                color='gray'
                onClick={() => onDetail(transaction)}>
                  Detail
              </ActionButton >
              <ActionButton
                color='blue'
                onClick={() => onEdit(transaction)}
              >
                  Edit
              </ActionButton>
              <ActionButton
                color='red'
                onClick={() => onDelete(transaction)}
              >
                  Delete
              </ActionButton>
            </TableCell>
        </TableRow>
    )
}


export type TransactionTableProps = {
    transactions: Transaction[],
    totalTransactions: number,
    pagination: PaginationProps,
    onDetail: (transaction: Transaction) => void,
    onEdit: (transaction: Transaction) => void,
    onDelete: (transaction: Transaction) => void
    loading: boolean
}

export default function TransactionTable({transactions= [], totalTransactions, pagination, onDetail, onEdit, onDelete, loading }: TransactionTableProps ) {

  return (
    <>
      <DataSummary
        totalItems={totalTransactions}
        currentCount={transactions.length}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        limit={10}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>
              Account
            </TableCell>

            <TableCell isHeader>
              Type
            </TableCell>

            <TableCell isHeader>
              Category
            </TableCell>
            <TableCell isHeader>
              Note
            </TableCell>
            <TableCell isHeader>
              Date
            </TableCell>
            <TableCell isHeader>
              Amount
            </TableCell>
            <TableCell isHeader>
              Action
            </TableCell>
          </TableRow>
        </TableHeader>
        
        <TableBody>

        {loading ? (
            <TableRow>
                <TableCell>
                  Loading .....
                </TableCell>
            </TableRow>
          ) :  transactions.length === 0 ? (
            <TableRow>
              <TableCell>
              No Data
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) =>
              <TransactionRow
                  key={transaction._id}
                  transaction={transaction}
                  onDetail={onDetail}
                  onEdit={onEdit}
                  onDelete={onDelete}
              />
              )
            )
          }
        </TableBody>
      </Table>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={pagination.onPageChange}
      />
    </>
  )
}
