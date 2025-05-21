'use client';

import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CategoryBreakdown from "@/features/reports/category/CategoryBreakdown";

export default function CategoryReportPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Report" />
        <Suspense fallback={<div>Loading...</div>}>
            <CategoryBreakdown/>
        </Suspense>
    </div>
  );
}
