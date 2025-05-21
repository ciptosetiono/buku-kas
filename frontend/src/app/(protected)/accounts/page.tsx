'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AccountManagement from '@/features/accounts/AccountManagement';

export default function AccountPage() {
  return (
    <div>
        <PageBreadcrumb pageTitle="Accounts" />
        <AccountManagement/>
    </div>
  );
}
