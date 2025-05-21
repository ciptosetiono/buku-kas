"use client";

import React from 'react';

import { Category } from './CategoryInterface';
import {Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow, } from '@/components/data-table';
import ActionButton from '@/components/data-table/ActionButton';
import Pagination, { PaginationProps } from '@/components/data-table/Pagination';
import DataSummary from '@/components/data-table/DataSummary';

export type CategoryTableProps = {
    categories: Category[],
    totalCategories: number,
    pagination: PaginationProps,
    onDetail: (cat: Category) => void,
    onEdit: (cat: Category) => void,
    onDelete: (cat: Category) => void
    loading: boolean
}

export default function CategoryTable({categories= [], totalCategories, pagination, onDetail, onEdit, onDelete, loading }: CategoryTableProps ) {

  return (
    <>
      <DataSummary
        totalItems={totalCategories}
        currentCount={categories.length}
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
          ) :  categories.length === 0 ? (
            <TableRow>
              <TableCell>
              No Data
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) =>
                  <TableRow key={cat._id}>
                    <TableCell>
                      {cat.name}
                    </TableCell>
                    <TableCell>
                      {cat.type}
                    </TableCell>
                    <TableCell>
                      <ActionButton 
                        color='gray'
                        onClick={() => onDetail(cat)}>
                          Detail
                      </ActionButton >
                      <ActionButton
                        color='blue'
                        onClick={() => onEdit(cat)}
                      >
                          Edit
                      </ActionButton>
                      <ActionButton
                        color='red'
                        onClick={() => onDelete(cat)}
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
