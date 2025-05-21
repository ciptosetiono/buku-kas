
"use client";

import React, { useState } from "react";
import axios from "axios";
import { Category } from "./CategoryInterface";
import Button from "@/components/ui/buttons/Button";
import Alert from "@/components/ui/alert/Alert";
import api from "@/lib/api";
import { DetailCard, DetailRow } from "@/components/data-detail";

interface CategoryDeleteProps {
  category?: Category;
  onDeleted: () => void;
  onCancel: () => void;
}

export default function CategoryDelete({category, onDeleted, onCancel}: CategoryDeleteProps) {
    
    const [isLoading, setIsloading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async() => {
       
        setIsloading(true);
        setError('');
        try {
          await api.delete(`/categories/${category?._id}`);
          setIsSuccess(true);
          onDeleted();
        } catch (err: unknown) {
          if(axios.isAxiosError(err)){
            if(err.response){
              setError(err.response.data?.message);
            }else{
              setError('Network error: Unable to reach the server.');
            }
          }else{
            setError('An unexpected error occurred.');
          }
        }
        setIsloading(false);
        
    }

    if(!category) return;
        
    return (
        <>
        <DetailCard title="Delete Account">
            <DetailRow label="Name" value={category.name}/>
            <DetailRow label="Balance" value={category.type}/>
            
        </DetailCard>
        <div className="p-4 bg-white shadow-md rounded-md">
            {error && <Alert variant='error' title='Error' message={error}/>}

            {isSuccess && <Alert variant='success' title='Success' message='Category Deleted Succesfully'/>}

            <p className="text-gray-700 mb-4">Are you sure you want to delete this item?</p>

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