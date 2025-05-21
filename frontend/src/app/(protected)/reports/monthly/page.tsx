'use client';

import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MonthlyTrend from "@/features/reports/monthly/MonthlyTrend";

export default function MonthlyReportPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Report" />
        <Suspense fallback={<div>Loading...</div>}>
            <MonthlyTrend/>
        </Suspense>
    </div>
  );
}
