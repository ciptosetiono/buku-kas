'use client';

import { useEffect, useState, useCallback } from 'react';
import api, { handleApiError } from '@/lib/api';
import { ActionModeType } from '@/components/data-table/DataTableTypes';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import Button from '@/components/ui/buttons/Button';
import Alert from '@/components/ui/alert/Alert';

import { Transfer } from './TransferInterface';
import TransferTable from './TransferTable';
import TransferForm from './TransferForm';
import TransferSearchForm, { TransferFilter } from './TransferSearchForm';
import TransferDetail from './TransferDetail';



export default function TransferManagement() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filter, setFilter] = useState<TransferFilter>({});
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { isOpen, openModal, closeModal } = useModal();
  const [actionMode, setActionMode] = useState<string>(ActionModeType.Create);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer>();

  const limit = 10;

  const fetchTransfers= useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/transfers', {
        params: { ...filter, page, limit },
      });
      setTransfers(response.data.data);

      
      setTotalItems(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleModalAction = (mode:string, transfer?: Transfer) => {
    setActionMode(mode);
    setSelectedTransfer(transfer);
    openModal();
  };

  const handleAfterAction = () => {
    fetchTransfers();
    closeModal();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          color="green"
          variant="primary"
          size="sm"
          onClick={() => handleModalAction(ActionModeType.Create)}
        >
          + Add
        </Button>
      </div>

      <TransferSearchForm
        onSubmit={(filterForm: TransferFilter) => setFilter(filterForm)}
      />

      {error && <Alert variant="error" title="Error" message={error} />}


      <TransferTable
        transfers={transfers}
        totalTransfers={totalItems}
         pagination={{
          currentPage: page,
          totalPages: totalPages,
          onPageChange: setPage
        }}
        onDetail={(transfer) => handleModalAction(ActionModeType.Detail, transfer)}
        loading={isLoading}
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[900px] m-4">
        {actionMode === ActionModeType.Detail && selectedTransfer && (
          <TransferDetail transfer={selectedTransfer} />
        )}
      
        {(actionMode == ActionModeType.Create || actionMode == ActionModeType.Edit) && (
          <TransferForm
            mode={actionMode}
            transfer={selectedTransfer}
            onSaved={handleAfterAction}
          />
        )}
      </Modal>
    </div>
  );
}
