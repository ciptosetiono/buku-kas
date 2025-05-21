'use client';

import { useState, useEffect, useCallback } from 'react';

import api, { handleApiError } from '@/lib/api';

import Alert from '@/components/ui/alert/Alert';
import { getDefaultFromDate, getDefaultToDate } from "@/utils/format";
import ReportFilterForm, { ReportFilterValues } from '../ReportFilterForm';
import AccountSummaryTable from '../accounts/AccountSummaryTable';
import { CashbookReportType } from '../ReportInterface';
import CashbookTransactionTable from './CashbookTransactionTable';
import CashbookExport from './CashbookExport';


// Main Page Component
export default function CashbookReport() {

  const [filters, setFilters] = useState<ReportFilterValues>({
    account: '',
    fromDate: getDefaultFromDate(),
    toDate: getDefaultToDate(),
  });

  const [report, setReport] = useState<CashbookReportType>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchReport = useCallback(async () => {
    const { account, fromDate, toDate } = filters;
    if (!fromDate || !toDate) return; // Jangan fetch kalau filter belum lengkap
    setIsLoading(true);
    try {
      const res = await api.get(`/reports/cashbook?account=${account}&fromDate=${fromDate}&toDate=${toDate}`);
      setReport(res.data);
      setError('');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);


  return (
     <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <ReportFilterForm
        onSubmit={(values: ReportFilterValues) => setFilters(values)}
      />

      {error && <Alert variant="error" title="Error" message={error} />}

      {isLoading ? (
        <div className="mb-4">Loading...</div>
      ) : (
        report && (
          <>
            <CashbookExport report={report} fromDate={filters.fromDate} toDate={filters.toDate}/>
            <AccountSummaryTable accounts={report?.accounts} />
            <CashbookTransactionTable transactions={report?.transactions} />
          </>
        )
      )}

    </div>
  );
}
