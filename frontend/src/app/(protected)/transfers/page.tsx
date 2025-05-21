'use client';

import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransferManagement from '@/features/transfers/TransferManagement';

export default function TransfersPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Transfers" />

        <Suspense fallback={<div>Loading...</div>}>
            <TransferManagement/>
        </Suspense>
    </div>
  );
}
