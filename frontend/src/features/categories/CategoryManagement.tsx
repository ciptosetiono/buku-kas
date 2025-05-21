'use client';

import { useEffect, useState, useCallback } from 'react';
import api, { handleApiError } from '@/lib/api';
import { ActionModeType } from '@/components/data-table/DataTableTypes';

import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import { AddButton } from '@/components/data-table/ActionButton';
import Alert from '@/components/ui/alert/Alert';

import { Category } from './CategoryInterface';
import CategoryTable from './CategoryTable';
import CategoryForm from './CategoryForm';
import CategorySearchForm, { CategoryFilter } from './CategorySearchForm';
import CategoryDetail from './CategoryDetail';
import CategoryDelete from './CategoryDelete';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [filter, setFilter] = useState<CategoryFilter>();
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { isOpen, openModal, closeModal } = useModal();
  const [actionMode, setActionMode] = useState<ActionModeType>(ActionModeType.Create);

  const [isLoading, setIsLoading] = useState(false);

  const [alertStatus, setAlertStatus ] = useState('');
  const [alertMessage, setAlertMessage] = useState('');


  const limit = 10;

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/categories', {
        params: { ...filter, page, limit },
      });
      setCategories(response.data.data);
      setTotalItems(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: unknown) {
      setAlertStatus('error');
      setAlertMessage(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleModalAction = (mode: ActionModeType, category?: Category) => {
    setActionMode(mode);
    setSelectedCategory(category);
    openModal();
  };

  const handleAfterAction = () => {
    setPage((prev) => {
      if (prev === 1) {
        fetchCategories(); // force fetch if already on page 1
        return 1;
      }
      return 1; // triggers useEffect which calls fetchAccounts
    });

    setAlertStatus('success');
    setAlertMessage(`Success ${actionMode} Category`);

    closeModal();
  };

  return (
    <div>

      {alertMessage && 
        <Alert
          variant={alertStatus == 'error' ? 'error' : 'success'}
          title={alertStatus}
          message={alertMessage}
          onClose={() => setAlertMessage('')}
        />
      }

      <AddButton  onClick={() => handleModalAction(ActionModeType.Create)}>
        + Add
      </AddButton>
     
      <CategorySearchForm
        onSubmit={(filterForm: CategoryFilter) => setFilter(filterForm)}
      />

      <CategoryTable
        categories={categories}
        totalCategories={totalItems}
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
        {actionMode === ActionModeType.Detail && selectedCategory && (
          <CategoryDetail category={selectedCategory} />
        )}
        {actionMode === ActionModeType.Delete && selectedCategory && (
          <CategoryDelete
            category={selectedCategory}
            onDeleted={handleAfterAction}
            onCancel={closeModal}
          />
        )}
        {actionMode !== ActionModeType.Detail && actionMode !== ActionModeType.Delete && (
          <CategoryForm
            mode={actionMode}
            category={selectedCategory}
            onSaved={handleAfterAction}
          />
        )}
      </Modal>
    </div>
  );
}
