'use client';

import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransactionManagement from '@/features/transactions/TransactionManagement';

export default function TransactionsPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Transactions" />

        <Suspense fallback={<div>Loading...</div>}>
            <TransactionManagement/>
        </Suspense>
    </div>
  );
}
