"use client";

import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/buttons/Button";
import { useState } from "react";

import TransactionAccountSelect from "./TransactionAccountSelect";
import TransactionCategorySelect from "./TransactionCategorySelect";
import { CategoryType } from "../categories/CategoryInterface";
import DatePicker from "@/components/form/date-picker";

export type TransactionFilter = {
  account?: string;
  type?: string;
  category?: string;
  note?: string;
  amount?: string;
  fromDate?: string;
  toDate?: string;
};

export type TransactionSearchFormProps = {
  onSubmit: (transactionFilter: TransactionFilter) => void;
};

export const typeSearchOptions = [
  { value: "", label: "All Type" },
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export default function TransactionSearchForm({ onSubmit }: TransactionSearchFormProps) {
  const [filter, setFilter] = useState<TransactionFilter>({
    account: "",
    type: "",
    category: "",
    note: "",
    amount: "",
    fromDate: "",
    toDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof TransactionFilter, value: string) => {
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
            value={filter.account}
            onChange={(value: string) => {
              updateFilter("account", value);
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
          <div>
          <Select
            id="type"
            value={filter.type}
            onChange={(value: string) => {
              updateFilter("type", value);
            }}
            options={typeSearchOptions}
          />
        </div>

        <div>
          <TransactionCategorySelect
            label={false}
            placeholder="All Category"
            type={filter.type as unknown as CategoryType}
            value={filter.category}
            onChange={(value: string) => {
              updateFilter("category", value);
            }}
          />
        </div>

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
