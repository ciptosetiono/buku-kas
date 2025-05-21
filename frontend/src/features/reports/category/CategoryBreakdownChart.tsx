import React from 'react';
import { ApexOptions } from 'apexcharts';
import { CategoryBreakdownInterface } from './CategoryBreakdwonInterface';
import dynamic from 'next/dynamic';

// Load ApexChart client-side only (ssr: false)
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function CategoryBreakdownChart({ type, categories }: { type: string, categories: CategoryBreakdownInterface[] }) {
  const series = categories.map(c => type == 'income' ? c.totalIncome : c.totalExpense);
  const labels = categories.map(c => c.categoryName);
  const total = series.reduce((acc, val) => acc + val, 0);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
    },
    labels: labels,
    legend: {
      position: 'bottom',
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          if (total === 0) return `${val.toLocaleString()} (0%)`;
          const percent = ((val / total) * 100).toFixed(1);
          return `${val.toLocaleString()} (${percent}%)`;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
    },
  };

  if (categories.length === 0) {
    return <div className="text-center p-4">No data available</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-lg">
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="pie"
        height={350}
      />
    </div>
  );
}
