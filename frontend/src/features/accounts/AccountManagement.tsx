'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import Account from '@/features/accounts/accountInterface';
import AccountTable from '@/features/accounts/AccountTable';
import InputSearch from '@/components/data-table/InputSearch';
import AccountForm from '@/features/accounts/AccountForm';
import AccountDetail from './AccountDetail';
import AccountDelete from './AccountDelete';
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Button from '@/components/ui/buttons/Button';
import Alert from '@/components/ui/alert/Alert';

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');
   const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [totalAccounts, setTotalAccounts] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState('');

  const { isOpen, openModal, closeModal } = useModal();
  const [actionMode, setActionMode] = useState<'Detail' | 'Create' | 'Edit' | 'Delete'>('Create');
  const [actionData, setActionData] = useState<Account>();

  
  // Debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);


  const fetchAccounts = useCallback(async () => {
    setIsloading(true);
    setError('');
    try {
      const res = await api.get('/accounts', {
        params: { keyword: debouncedSearch, page, limit }
      });
      setAccounts(res.data.data);
      setTotalAccounts(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(err.response.data?.message);
        } else if (err.request) {
          setError('Network error: Unable to reach the server.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
    setIsloading(false);
  }, [debouncedSearch, page]);


  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleModalAction = (mode: 'Create' | 'Edit' | 'Detail' | 'Delete', data?: Account) => {
    setActionMode(mode);
    setActionData(data);
    openModal();
  };

  const refreshAccounts = () => {
    //refresh data with refresh the page number
    setPage((prev) => {
      if (prev === 1) {
        fetchAccounts(); // force fetch if already on page 1
        return 1;
      }
      return 1; // triggers useEffect which calls fetchAccounts
    });
    closeModal();
  };


  return (
    <div>
      <div className="flex justify-end mb-4">
          <Button
            onClick={() => handleModalAction('Create')}
            color='green'
            variant='primary'
            size='sm'
          >
              + Add
          </Button>
      </div>
      {error && <Alert variant='error' title='Error' message={error}/>}

        <InputSearch 
          placeholder='search by name'
          value={search}
          onChange={(value) => setSearch(value)}
        />

        <AccountTable
          accounts={accounts}
          totalAccounts={totalAccounts}
          pagination={{
            currentPage: page,
            totalPages: totalPages,
            onPageChange:setPage
          }}
          onDetail={(account) => handleModalAction('Detail', account)}
          onEdit={(account) => handleModalAction('Edit', account)}
          onDelete={(account) => handleModalAction('Delete', account)}
          loading={isLoading}
        />

        <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[900px] m-4">
            {actionMode === 'Detail' ? (
              <AccountDetail
                account={actionData}
              />
            ) : actionMode === 'Delete' ? (
            <AccountDelete
                account={actionData}
                onDeleted={ refreshAccounts}
                onCancel={closeModal}
              />
            ) : (
              <AccountForm
                mode={actionMode}
                account={actionData}
                onSaved={refreshAccounts}
              />
            )}
        </Modal>
    </div>
  );
}
