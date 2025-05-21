
"use client";

import Account  from "./accountInterface";
import React, { useState } from "react";
import Button from "@/components/ui/buttons/Button";
import Alert from "@/components/ui/alert/Alert";
import api from "@/lib/api";
import { DetailCard, DetailRow } from "@/components/data-detail";
import axios from "axios";
interface AccountDeleteProps {
  account?: Account;
  onDeleted: () => void;
  onCancel: () => void;
}

export default function AccountDelete({account, onDeleted, onCancel}: AccountDeleteProps) {
    
    const [isLoading, setIsloading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async() => {
       
        setIsloading(true);
        setError('');
        try {
          await api.delete(`/accounts/${account?._id}`);
          setIsSuccess(true);
          onDeleted();
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
        
    }

    if(!account) return;
        
    return (
        <>
        <DetailCard title="Delete Account">
            <DetailRow label="Name" value={account.name}/>
            <DetailRow label="Balance" value={account.balance.toString()}/>
            
        </DetailCard>
        <div className="p-4 bg-white shadow-md rounded-md">
            {error && <Alert variant='error' title='Error' message={error}/>}

            {isSuccess && <Alert variant='success' title='Success' message='Account Deleted Succesfully'/>}

            <p className="text-gray-700 mb-4">Are you sure you want to delete the account?</p>

            <div className="flex space-x-4">
                <Button
                    color="red"
                    onClick={handleDelete}
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    Yes
                </Button>
                <Button
                    color="gray"
                    onClick={onCancel}
                >
                    No
                </Button>
            </div>
        </div>
        </>
    );

}