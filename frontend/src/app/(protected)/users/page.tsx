'use client';

import { Suspense } from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserManagement from '@/features/users/UserManagement';

export default function CategoriesPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Users" />
        <Suspense fallback={<div>Loading...</div>}>
            <UserManagement />
        </Suspense>
    </div>
  );
}