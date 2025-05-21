"use client";

import React from 'react';

import { User } from './UserInterface';

import {Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow, } from '@/components/data-table';
import ActionButton from '@/components/data-table/ActionButton';

export type UserTableProps = {
    users: User[],
    onDetail: (user:User) => void,
    onEdit: (user:User) => void,
    onDelete: (user:User) => void,
    onEditPassword: (user:User) => void
    loading: boolean
}

export default function UserTable({users= [], onDetail, onEdit, onDelete, onEditPassword, loading }: UserTableProps ) {

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell isHeader>
            Name
          </TableCell>
          <TableCell isHeader>
            Email
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
        ) :  users.length === 0 ? (
          <TableRow>
            <TableCell>
            No Data
            </TableCell>
          </TableRow>
        ) : (
          users.map((user: User) =>
                <TableRow key={user._id}>
                  <TableCell>
                     {user.name}
                  </TableCell>
                  <TableCell>
                     {user.email}
                  </TableCell>
                  <TableCell>
                    <ActionButton 
                      color='gray'
                      onClick={() => onDetail(user)}>
                        Detail
                    </ActionButton >
                    <ActionButton
                      color='blue'
                      onClick={() => onEdit(user)}
                    >
                        Edit
                    </ActionButton>
                    <ActionButton
                      color='orange'
                      onClick={() => onEditPassword(user)}
                    >
                        Edit Password
                    </ActionButton>
                    <ActionButton
                      color='red'
                      onClick={() => onDelete(user)}
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
  )
}
