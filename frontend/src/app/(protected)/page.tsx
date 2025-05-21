
import type { Metadata } from "next";
import React from "react";
import { Suspense } from "react";

import MonthlyTrend from "@/features/reports/monthly/MonthlyTrend";

export const metadata: Metadata = {
  title:
    "BUKU KAS",
  description: "Aplikasi Buku KaS PT STIK Indonesia",
};

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <Suspense fallback={<div> Loading ... </div>}>
          <MonthlyTrend/>
        </Suspense>
      </div>
    </div>
  );
}
