"use client";
import React  from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MonthlyTrendInterface } from "./MontlyTrendInterface";
import { monthNames } from "@/utils/constants";


const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});


export default function MonthlyTrendChart( {trends } : {trends: MonthlyTrendInterface[]}) {

  const categories = trends.map((t) => `${monthNames[t.month]} ${t.year}`);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: [ "#f87171", "#10b981", "#60a5fa", "#facc15"], //  red, green, blue, yellow
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%"
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
    },
    legend: {
      position: "top",
    },
    fill: {
      opacity: 1,
    },
  };

  const series = [
    {
      name: "Income",
      data: trends.map((t) => t.totalIncome),
    },
    {
      name: "Expense",
      data: trends.map((t) => t.totalExpense),
    },
    {
      name: "End Balance",
      data: trends.map((t) => t.currentBalance),
    },
  ];

  return (
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
  );
}
