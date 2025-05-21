"use client";

import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/buttons/Button";
import { useState } from "react";

import TransactionAccountSelect from "../transactions/TransactionAccountSelect";

import DatePicker from "@/components/form/date-picker";

export type TransferFilter = {
  fromAccount?: string;
  toAccount?: string;
  fromDate?: string;
  toDate?: string;
  note?: string;
  amount?: string;
};

export type TransferSearchFormProps = {
  onSubmit: (transactionFilter: TransferFilter) => void;
};


export default function TransferSearchForm({ onSubmit }: TransferSearchFormProps) {
  const [filter, setFilter] = useState<TransferFilter>({
    fromAccount: "",
    toAccount: "",
    fromDate: "",
    toDate: "",
    note: "",
    amount: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof TransferFilter, value: string) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await onSubmit(filter);
    setIsLoading(false);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
         <div>
          <TransactionAccountSelect
            label={false}
            placeholder="From Account"
            value={filter.fromAccount}
            onChange={(value: string) => {
              updateFilter("fromAccount", value);
            }}
          />
        </div>
        <div>
          <TransactionAccountSelect
            label={false}
            placeholder="To Account"
            value={filter.toAccount}
            onChange={(value: string) => {
              updateFilter("toAccount", value);
            }}
          />
        </div>

         <div className="flex-grow">
            <DatePicker
              id="fromDate"
              placeholder="From Date"
              defaultDate={filter.fromDate}
              onChange={(dates: Date[]) => {
                const value = dates.length > 0 ? dates[0].toLocaleDateString("en-CA") : "";
                updateFilter("fromDate", value);
              }}
            />
          </div>

        <div className="flex-grow">
          <DatePicker
            id="toDate"
            placeholder="To Date"
            defaultDate={filter.toDate}
            onChange={(dates: Date[]) => {
              const value = dates.length > 0 ? dates[0].toLocaleDateString("en-CA") : "";
              updateFilter("toDate", value);
            }}
          />
        </div>

        <div>
          <Button
            variant="ghost"
            className="text-sm text-blue-500"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? "Hide Filters ▲" : "Show More Filters ▼"}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-grow">
            <Input
              placeholder="Search by note"
              value={filter.note}
              onChange={(event) => updateFilter("note", event.target.value)}
            />
          </div>
          <div className="flex-grow">
              <Input
                placeholder="Search by Amount"
                value={filter.amount}
                onChange={(event) => updateFilter("amount", event.target.value)}
              />
          </div>
        </div>
      )}

      <div>
        <Button
          color="gray"
          variant="outline"
          className="w-full sm:w-auto"
          isLoading={isLoading}
          disabled={isLoading}
          onClick={handleSubmit}
        >
          Search
        </Button>
      </div>
    </div>
  );
}
