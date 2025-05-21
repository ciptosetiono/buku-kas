"use client"

import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/buttons/Button";
import { useEffect, useState } from "react";

export type UserFilter = {
  name?: string;
  email?: string;
}

export type UserSearchFormProps = {
  onSubmit: (userFilter: UserFilter) => void
};


export default function UserSearchForm({onSubmit} : UserSearchFormProps ) {

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ filter, setFilter] = useState<UserFilter>({});
  const [ isLoading, setIsloading ] = useState(false);

  useEffect(() => {
    setFilter ({
      name,
      email
    });
  }, [name, email]);

  const handleSubmit = async () => {
    setIsloading(true)
    await onSubmit(filter);
    setIsloading(false);
  }


  return (
    <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-grow">
          <Input
            placeholder="Search by name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

         <div className="flex-grow">
          <Input
            placeholder="Search by Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
