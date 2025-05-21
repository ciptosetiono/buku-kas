'use client';

import { useEffect, useState, useCallback } from 'react';
import api, { handleApiError } from '@/lib/api';
import Pagination from '@/components/data-table/Pagination';
import DataSummary from '@/components/data-table/DataSummary';
import { ActionModeType } from '@/components/data-table/DataTableTypes';
import { Modal } from '@/components/ui/modal';
import { useModal } from '@/hooks/useModal';
import Button from '@/components/ui/buttons/Button';
import Alert from '@/components/ui/alert/Alert';

import { User } from './UserInterface';
import UserTable from './UserTable';
import UserCreateForm from './UserCreateForm';
import UserEditForm from './UserEditForm';
import UpdatePasswordForm from './UserPasswordForm';
import UserSearchForm, { UserFilter } from './UserSearchForm';
import UserDetail from './UserDetail';
import UserDelete from './UserDelete';



export default function UserManagement() {
  const [users, setUsers ] = useState<User[]>([]);
  const [filter, setFilter] = useState<UserFilter | undefined>(undefined);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { isOpen, openModal, closeModal } = useModal();
  const [actionMode, setActionMode] = useState<ActionModeType | 'Edit Password'>(ActionModeType.Create);
  const [selectedUser, setSelectedUser] = useState<User>();

  const limit = 10;

  const fetchUsers= useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/users', {
        params: { ...filter, page, limit },
      });
      setUsers(response.data.data);
      setTotalItems(response.data.total || 0);
      setTotalPages(response.data.totalPages || 1);
    } catch (err: unknown) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [filter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleModalAction = (mode: ActionModeType | 'Edit Password', user?: User) => {
    setActionMode(mode);
    setSelectedUser(user);
    openModal();
  };

  const handleAfterAction = () => {
    fetchUsers();
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

      <UserSearchForm
        onSubmit={(filterForm: UserFilter) => setFilter(filterForm)}
      />

      {error && <Alert variant="error" title="Error" message={error} />}

      <DataSummary
        totalItems={totalItems}
        currentCount={users.length}
        currentPage={page}
        totalPages={totalPages}
        limit={limit}
      />

      <UserTable
        users={users}
        onDetail={(user) => handleModalAction(ActionModeType.Detail, user)}
        onEdit={(user) => handleModalAction(ActionModeType.Edit, user)}
        onDelete={(user) => handleModalAction(ActionModeType.Delete, user)}
        onEditPassword={(user) => handleModalAction('Edit Password', user)}
        loading={isLoading}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[900px] m-4">
        {actionMode === ActionModeType.Detail && selectedUser && (
          <UserDetail user={selectedUser} />
        )}

        {actionMode == ActionModeType.Create && (
          <UserCreateForm
            onSaved={handleAfterAction}
          />
        )}

        {(actionMode == "Edit Password"  && selectedUser) && (
          <UpdatePasswordForm
            user={selectedUser}
            onSaved={handleAfterAction}
          />
        )}

        {(actionMode == ActionModeType.Edit && selectedUser) && (
          <UserEditForm
            user={selectedUser}
            onSaved={handleAfterAction}
          />
        )}

        {(actionMode == ActionModeType.Delete && selectedUser) && (
          <UserDelete
            user={selectedUser}
            onDeleted={handleAfterAction}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}
