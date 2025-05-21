import React, { useEffect, useState } from 'react';
import { getDefaultFromDate, getDefaultToDate } from '@/utils/format';
import api, {handleApiError} from "@/lib/api";
import Alert from '@/components/ui/alert/Alert';
import ReportFilterForm, { ReportFilterValues } from '../ReportFilterForm';
import { CategoryBreakdownInterface } from './CategoryBreakdwonInterface';
import CategoryBreakdownChart from './CategoryBreakdownChart';
import CategoryBreakdownTable from './CategoryBreakdownTable';

export default function CategoryBreakdown() {
    const [incomeCategories, setIncomeCategories] = useState<CategoryBreakdownInterface[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<CategoryBreakdownInterface[]>([]);
    const [filters, setFilters] = useState<ReportFilterValues>({
        account: '',
        fromDate: getDefaultFromDate(),
        toDate: getDefaultToDate(),
    });
  
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    async function fetchData() {
        const { account, fromDate, toDate } = filters;
        if (!fromDate || !toDate) return;

        setIsLoading(true);
        setError('');

        try {
            const incomeResponse = await api.get(`/reports/category-breakdown?type=income&account=${account}&fromDate=${fromDate}&toDate=${toDate}`);
            setIncomeCategories(incomeResponse.data.categories);

            const expenseResponse = await api.get(`/reports/category-breakdown?account=${account}&fromDate=${fromDate}&toDate=${toDate}`);
            setExpenseCategories(expenseResponse.data.categories);
            
        } catch (err: unknown) {
            const apiError = handleApiError(err);
            setError(apiError);
        } finally {
            setIsLoading(false);
        }
    }

    fetchData();
}, [filters]);


  return (
     <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
        <ReportFilterForm
            onSubmit={(values: ReportFilterValues) => setFilters(values)}
        />

        {error && <Alert variant="error" title="Error" message={error} />}

        {isLoading ? (
            <div className="mb-4">Loading...</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2">Income</h2>
                    <CategoryBreakdownChart
                        type="income"
                        categories={incomeCategories}
                    />
                    <CategoryBreakdownTable 
                        type="income"
                        categories={incomeCategories}
                    />
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2">Expense</h2>
                    <CategoryBreakdownChart
                        type="expense"
                        categories={expenseCategories}
                    />
                    <CategoryBreakdownTable
                        type="expense"
                        categories={expenseCategories}
                    />
                </div>
            </div>
        )}
    </div>
  );
}
