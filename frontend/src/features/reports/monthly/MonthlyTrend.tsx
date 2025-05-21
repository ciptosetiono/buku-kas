"use client";

import React, { useEffect, useState, useCallback } from "react";
import Alert from "@/components/ui/alert/Alert";
import MonthlyTrendChart from "./MonthlyTrendChart";
import MonthlyTrendTable from "./MonthlyTrendTable";
import ReportFilterForm, { ReportFilterValues } from "../ReportFilterForm";
import { MonthlyTrendInterface } from "./MontlyTrendInterface";
import fetchMonthlyTrend from "./fetchMonthlyTrend";
import { getDefaultToDate } from "@/utils/format";


const getLastMonthsDate = (monthsAgo: number = 11): string => {
  const today = new Date();
  const fromDateObj = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);

  console.log(fromDateObj);
  return fromDateObj.toISOString().slice(0, 10);
};

const MonthlyTrend = () => {
  const [filters, setFilters] = useState<ReportFilterValues>({
    account: "",
    fromDate: getLastMonthsDate(11),
    toDate: getDefaultToDate(),
  });

  const [trends, setTrends] = useState<MonthlyTrendInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    if (!filters.fromDate || !filters.toDate) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMonthlyTrend(filters);
      setTrends(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch monthly trends.");
      }
      setTrends([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-6 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Cashflow Trend
          </h3>
          <p className="mt-1 text-gray-500 text-sm">
            Income, expense, and balances per month
          </p>
        </div>
      </div>

      <ReportFilterForm defaultValues={filters} onSubmit={setFilters} />

      {error && <Alert variant="error" title="Error" message={error} />}

      {isLoading ? (
        <div className="text-gray-500 mt-4">Loading...</div>
      ) : trends.length > 0 ? (
        <>
          <MonthlyTrendChart trends={trends} />
          <MonthlyTrendTable trends={trends} />
        </>
      ) : (
        <p className="text-sm text-gray-500 mt-4">No trend data available.</p>
      )}
    </div>
  );
};

export default MonthlyTrend;
