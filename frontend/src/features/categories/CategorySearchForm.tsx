"use client"

import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Button from "@/components/ui/buttons/Button";
import { useEffect, useState } from "react";

export type CategoryFilter = {
  name?: string;
  type?: string;
}

export type CategorySearchFormProps = {
  onSubmit: (categoryFilter: CategoryFilter) => void
};

export const typeSearchOptions = [
  { value: '', label: 'All Category ' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];


export default function CategorySearchForm({onSubmit} : CategorySearchFormProps ) {

  const [ name, setName ] = useState('');
  const [ type, setType ] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>({});
  const [ isLoading, setIsloading ] = useState(false);

  useEffect(() => {
    setFilter ({
      name,
      type
    });
  }, [name, type]);

  const handleSubmit = async () => {
    setIsloading(true)
    await onSubmit(filter);
    setIsloading(false);
  }


  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-grow">
          <Input
            placeholder="Search by category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          {/* Replace this with your custom Select if needed */}
          <Select
              id="type"
              value={type}
              onChange={(value: string) => {
                setType(value)}
              }
              options={typeSearchOptions}
          />
        </div>

        <div>
          <Button
            color="gray"
            variant="outline"
            className="w-full"
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
