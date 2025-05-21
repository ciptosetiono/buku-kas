import { useEffect, useState } from "react";

import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import api, {handleApiError} from "@/lib/api";
import { Category, CategoryType } from "../categories/CategoryInterface";


export type TransactionCategorySelectProps = {
    label?:string | boolean;
    placeholder?: string;
    value?: string;
    type?: CategoryType,
    onChange: (value: string) => void
}

export const TransactionCategorySelect = ({label, placeholder, value, type, onChange} : TransactionCategorySelectProps ) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading ] = useState(false);
    const [error, setIsError] = useState();

    useEffect(() => {
        if(type){
            const fetchCategories = async () => {
                setIsLoading(true);
                try {
                    const response = await api.get('/categories', {
                        params: { type },
                    });
                    setCategories(Array.isArray(response.data.data) ? response.data.data : []);
                } catch (error) {
                    const apiError = handleApiError(error);
                    setIsError(apiError);
                }finally {
                    setIsLoading(false);
                }
            };
            fetchCategories();
        }else{
            setCategories([]);
        }
       
    }, [type]);

    return (
        <div>
            {label !== false && (
                <Label htmlFor="category">
                    {label? label : "Category"} <span className="text-error-500">*</span>
                </Label>
            )}  

            {error && <div className="text-red-500">{error}</div>}
            {isLoading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading categories...
                </p>
            ) : (
                

                <Select
                    id="category"
                    placeholder={type ? (placeholder ? placeholder : "Select Category") : "Select Type First"}
                    value={value}
                    onChange={onChange}
                    options={categories.map((category) => ({
                        value: category._id,
                        label: category.name,
                    }))}
                />
            )}      
           
        </div>
    );
}

export default TransactionCategorySelect;