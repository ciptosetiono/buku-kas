'use client';

import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CashbookReport from '@/features/reports/cashbook/CashbookReport';

export default function ReportPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Cashbook Report" />
        <Suspense fallback={<div>Loading...</div>}>
            <CashbookReport/>
        </Suspense>
    </div>
  );
}
