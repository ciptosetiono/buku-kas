"use client";

import React from 'react';

import Account from './accountInterface';
import {Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow, } from '@/components/data-table';
import Pagination, { PaginationProps } from '@/components/data-table/Pagination';
import DataSummary from '@/components/data-table/DataSummary';
import ActionButton from '@/components/data-table/ActionButton';
import { formatRupiah } from '@/utils/format';

export type AccountTableProps = {
  accounts: Account[],
  totalAccounts: number,
  pagination: PaginationProps,
  onDetail: (acc: Account) => void,
  onEdit: (acc: Account) => void,
  onDelete: (acc: Account) => void,
  loading: boolean,
}

export default function AccountTable({accounts = [], totalAccounts, pagination,  onDetail, onEdit, onDelete, loading}: AccountTableProps ) {

  return (
    <>
      <DataSummary
        totalItems={totalAccounts}
        currentCount={accounts.length}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        limit={10}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>
              Name
            </TableCell>
            <TableCell isHeader>
              Balance
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
          ) : accounts.length === 0 ? (
            <TableRow>
              <TableCell>
              No Data
              </TableCell>
            </TableRow>
          ) : (
            accounts.map((acc) =>
                  <TableRow key={acc._id}>
                    <TableCell>
                      {acc.name}
                    </TableCell>
                    <TableCell>
                      {formatRupiah(acc.balance)}
                    </TableCell>
                    <TableCell>
                      <ActionButton 
                        color='gray'
                        onClick={() => onDetail(acc)}>
                          Detail
                      </ActionButton >
                      <ActionButton
                        color='blue'
                        onClick={() => onEdit(acc)}
                      >
                          Edit
                      </ActionButton>
                      <ActionButton
                        color='red'
                        onClick={() => onDelete(acc)}
                      >
                          Delete
                      </ActionButton>
                    </TableCell>
                </TableRow>
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
