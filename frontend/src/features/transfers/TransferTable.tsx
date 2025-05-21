"use client";

import React from 'react';

import  { Transfer } from './TransferInterface';
import {Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow, } from '@/components/data-table';
import ActionButton from '@/components/data-table/ActionButton';
import { formatTanggal, formatRupiah } from '@/utils/format';
import Pagination, { PaginationProps } from '@/components/data-table/Pagination';
import DataSummary from '@/components/data-table/DataSummary';

export type TransferRowProps = {
    transfer: Transfer,
    onDetail: (transfer: Transfer) => void
}

export const TransferRow = ({transfer, onDetail} : TransferRowProps) => {
    return (
       <TableRow key={transfer._id}>
            <TableCell>
              { formatTanggal(transfer.date) }
            </TableCell>
            <TableCell>
                {transfer.fromAccount.name}
            </TableCell>
            <TableCell>
              {transfer.toAccount.name}
            </TableCell>
            <TableCell>
                {transfer.note}
            </TableCell>
           
            <TableCell>
              {formatRupiah(transfer.amount)}
            </TableCell>
            <TableCell>
              <ActionButton 
                color='gray'
                onClick={() => onDetail(transfer)}>
                  Detail
              </ActionButton >
            </TableCell>
        </TableRow>
    )
}


export type TransferTableProps = {
    transfers: Transfer[],
    totalTransfers: number,
    pagination: PaginationProps,
    onDetail: (transfer: Transfer) => void,
    loading: boolean
}

export default function TransferTable({transfers= [], totalTransfers, pagination, onDetail, loading }: TransferTableProps ) {


  return (
    <>
     <DataSummary
        totalItems={totalTransfers}
        currentCount={transfers.length}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        limit={10}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell isHeader>
            Date
            </TableCell>
            <TableCell isHeader>
              From Account
            </TableCell>
            <TableCell isHeader>
              To Account
            </TableCell>
            <TableCell isHeader>
              Note
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
          ) :  transfers.length === 0 ? (
            <TableRow>
              <TableCell>
              No Data
              </TableCell>
            </TableRow>
          ) : (
            transfers.map((transfer) =>
              <TransferRow
                  key={transfer._id}
                  transfer={transfer}
                  onDetail={onDetail}
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
