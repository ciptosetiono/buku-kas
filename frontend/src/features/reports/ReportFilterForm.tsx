"use client";

import { useEffect, useState } from "react";
import TransactionAccountSelect from "@/features/transactions/TransactionAccountSelect";
import DatePicker from "@/components/form/date-picker";
import Button from "@/components/ui/buttons/Button";
import { getDefaultFromDate, getDefaultToDate } from "@/utils/format";

export type ReportFilterValues = {
  account?: string;
  fromDate: string;
  toDate: string;
};

export type ReportFilterProps = {
  defaultValues?: ReportFilterValues,
  onValuesChange?: (values: ReportFilterValues) => void;
  onSubmit: (values: ReportFilterValues) => void;
};

export default function ReportFilterForm({
  defaultValues,
  onValuesChange,
  onSubmit,
}: ReportFilterProps) {
  const [account, setAccount] = useState(defaultValues?.account || '');
  const [fromDate, setFromDate] = useState(defaultValues?.fromDate || getDefaultFromDate());
  const [toDate, setToDate] = useState(defaultValues?.toDate || getDefaultToDate());

  // Handle filter changes
  useEffect(() => {
    const values = { account, fromDate, toDate };
    onValuesChange?.(values);
  }, [account, fromDate, toDate, onValuesChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ account, fromDate, toDate });
  };

  return (
<form
  onSubmit={handleSubmit}
  className="flex flex-wrap justify-between items-end gap-4 mb-6"
>
  <div className="flex-1 min-w-[200px]">
    <TransactionAccountSelect
      placeholder="All Accounts"
      label="Account"
      value={account}
      onChange={setAccount}
    />
  </div>

  <div className="flex-1 min-w-[160px]">
    <DatePicker
      id="fromDate"
      label="From Date"
      defaultDate={new Date(fromDate)}
      onChange={(dates: Date[]) =>
        setFromDate(dates.length > 0 ? dates[0].toISOString() : '')
      }
    />
  </div>

  <div className="flex-1 min-w-[160px]">
    <DatePicker
      id="toDate"
      label="To Date"
      defaultDate={new Date(toDate)}
      onChange={(dates: Date[]) =>
        setToDate(dates.length > 0 ? dates[0].toISOString() : '')
      }
    />
  </div>

  <div className="w-auto">
    <Button type="submit" variant="outline">
      Search
    </Button>
  </div>
</form>

  );
}
