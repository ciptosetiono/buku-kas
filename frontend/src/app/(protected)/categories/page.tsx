'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CategoryManagement from '@/features/categories/CategoryManagement';

export default function CategoriesPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Categories" />
        <CategoryManagement/>
    </div>
  );
}
