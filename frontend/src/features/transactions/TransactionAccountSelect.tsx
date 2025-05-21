import { useEffect, useState } from "react";

import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import api, {handleApiError} from "@/lib/api";
import Account from "../accounts/accountInterface";


export type TransactionAccountSelectProps = {
    label?:string | boolean;
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void
}

export const TransactionAccountSelect = ({label, placeholder, value, onChange} : TransactionAccountSelectProps) => {
    const [isLoading, setIsLoading ] = useState(true);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [ error, setError ] = useState();

    useEffect(() => {
        setIsLoading(true);
        const fetchAccounts= async () => {
            try {
                const response = await api.get('/accounts');
                setAccounts(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                const apiError = handleApiError(error);
                setError(apiError);
            }
        };
        fetchAccounts();
        setIsLoading(false);
    }, []);

    return (
        <div>
            {label !== false && (
                <Label htmlFor="accountId">
                    {label? label : "Account"} <span className="text-error-500">*</span>
                </Label>
            )}

            {isLoading ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Loading Accounts ...
                </p>
            ) : (
                <>
                    {error && <div className="text-red-500">{error}</div>}
                    
                    <Select
                        id="accountId"
                        placeholder={placeholder ? placeholder : "Select Account"}
                        value={value}
                        onChange={onChange}
                        options={accounts.map((account: Account) => ({
                            value: account._id,
                            label: account.name,
                        }))}
                    />
                </>
            )}      
        </div>
    );
}

export default TransactionAccountSelect;