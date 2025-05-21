"use client";
import React from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import UserProfileForm from "./UserProfileForm";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import { User } from "./UserInterface";
import Alert from "@/components/ui/alert/Alert";
import { PencilIcon } from "lucide-react";
import PageLoader from "@/components/ui/loader/PageLoader";
import axios from "axios";

export default function UserInfoCard() {

  const { isOpen, openModal, closeModal } = useModal();
  const [ user, setUser ] = useState<User>();
  const [ error, setError ] = useState('');
  const [ isLoading, setIsLoading ] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get<User>("/users/me");
        setUser(response.data);
      } catch (err: unknown) {
        if(axios.isAxiosError(err)){
          if(err.response){
            const messages = err?.response?.data?.message;
            const msg = Array.isArray(messages) ? messages.join(", ") : messages || "Failed to fetch user";
            setError(msg);
          }else{
            setError('Network error: Unable to reach the server.');
          }
        }else{
          setError('An unexpected error occurred.');
        }
      
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSuccessUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <PageLoader/>
    );
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>
          {error && (<Alert variant='error' title='Error' message={error}/>)}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nama
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.name}
              </p>
            </div>
           
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <PencilIcon className="h-5 w-5"/>
            Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        {user && <UserProfileForm user={user} onSuccess={handleSuccessUpdate}/>}
      </Modal>
    </div>
  );
}
