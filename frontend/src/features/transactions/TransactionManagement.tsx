'use client';

import { useEffect, useState, useCallback } from 'react';
import api, { handleApiError } from '@/lib/api';
import { ActionModeType } from '@/components/data-table/DataTableTypes';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import Button from '@/components/ui/buttons/Button';
import Alert from '@/components/ui/alert/Alert';

import { Transaction, TransactionType } from './TransactionInterface';
import TransactionTable from './TransactionTable';
import TransactionForm from './TransactionForm';
import TransactionSearchForm, { TransactionFilter } from './TransactionSearchForm';
import TransactionDetail from './TransactionDetail';
import TransactionDelete from './TransactionDelete';

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction>();

  const [filter, setFilter] = useState<TransactionFilter>();
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isOpen, openModal, closeModal } = useModal();
  const [actionMode, setActionMode] = useState<string>(ActionModeType.Create);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

 
  const limit = 10;

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/transactions', {
        params: { ...filter, page, limit },
      });
      setTransactions(response.data.data);
      setTotalItems(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleModalAction = (mode:string, transaction?: Transaction) => {
    if(mode == "Create Income") {  
      transaction = { type: TransactionType.Income } as Transaction;
    }
    if(mode == "Create Expense") {  
      transaction = { type: TransactionType.Expense } as Transaction;
    }
    setActionMode(mode);
    setSelectedTransaction(transaction);
    openModal();
  };

  const handleAfterAction = () => {
    fetchCategories();
    closeModal();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          color="green"
          variant="primary"
          size="sm"
          onClick={() => {
            handleModalAction(ActionModeType.Create, { type: TransactionType.Income } as Transaction);
          }}
        >
          + Income
        </Button>
         <Button
          color="red"
          variant="primary"
          size="sm"
          onClick={() => { handleModalAction(ActionModeType.Create, { type: TransactionType.Expense} as Transaction);}}
        >
          + Expense
        </Button>
      </div>

      <TransactionSearchForm
        onSubmit={(filterForm: TransactionFilter) => setFilter(filterForm)}
      />

      {error && <Alert variant="error" title="Error" message={error} />}


      <TransactionTable
        transactions={transactions}
        totalTransactions={totalItems}
        pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage
        }}
        onDetail={(category) => handleModalAction(ActionModeType.Detail, category)}
        onEdit={(category) => handleModalAction(ActionModeType.Edit, category)}
        onDelete={(category) => handleModalAction(ActionModeType.Delete, category)}
        loading={isLoading}
      />


      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[900px] m-4">
        {actionMode === ActionModeType.Detail && selectedTransaction && (
          <TransactionDetail transaction={selectedTransaction} />
        )}
        {actionMode === ActionModeType.Delete && selectedTransaction && (
          <TransactionDelete
            transaction={selectedTransaction}
            onDeleted={handleAfterAction}
            onCancel={closeModal}
          />
        )}
        {(actionMode == ActionModeType.Create || actionMode == ActionModeType.Edit) && (
          <TransactionForm
            mode={actionMode}
            transaction={selectedTransaction}
            onSaved={handleAfterAction}
          />
        )}
      </Modal>
    </div>
  );
}
