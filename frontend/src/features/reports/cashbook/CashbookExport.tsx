"use client";

import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CashbookReportType } from '../ReportInterface';
import { formatRupiah, formatTanggal } from '@/utils/format';
import DropdownButton from '@/components/ui/buttons/DropdownButton';
import { countTotalAllAccount, totalAccount as totalAccountType} from '../accounts/AccountSummaryTable';


export const handleExportPdf = (report: CashbookReportType, fromDate: string, toDate: string) => {
  if (!report) return;

  const totalAllAccount: totalAccountType = countTotalAllAccount(report.accounts);

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Judul Laporan
  const title = 'Laporan Buku Kas';
  const titleWidth = doc.getTextWidth(title);
  const titleX = (pageWidth - titleWidth) / 2;

  doc.setFontSize(16);
  doc.text(title, titleX, 15);

  doc.setFontSize(10);
  doc.text(`Periode: ${formatTanggal(fromDate)} - ${formatTanggal(toDate)}`, 14, 22); // Tambahkan periode kalau tersedia

  doc.setFontSize(14);
  doc.text(`Data Account`, 14, 30); // Tambahkan periode kalau tersedia


  let finalY = 34;

  // Tabel Ringkasan Akun
  autoTable(doc, {
    startY: finalY,
    head: [['Akun', 'Saldo Awal', 'Total Pemasukan', 'Total Pengeluaran', 'Selisih', 'Saldo Akhir']],
   body: [
      ...report.accounts.map((acc) => [
        acc.name || '-',
        formatRupiah(acc.startBalance) || '-',
        formatRupiah(acc.totalIncome) || '',
        formatRupiah(acc.totalExpense) || '',
        formatRupiah(acc.totalIncome - acc.totalExpense),
        formatRupiah(acc.currentBalance),
      ]),
      [
        { content: 'Total', colSpan: 1, styles: { fontStyle: 'bold' } },
        formatRupiah(totalAllAccount.startBalance),
        formatRupiah(totalAllAccount.income),
        formatRupiah(totalAllAccount.expense),
        formatRupiah(totalAllAccount.different),
        formatRupiah(totalAllAccount.currentBalance),
      ]
    ],
    styles: { fontSize: 9 },
    didDrawPage: (data) => {
      finalY = (data.cursor?.y ?? 0) + 10;
    },
  });

  doc.setFontSize(14);
  doc.text(`Data Transaksi`, 14, finalY); // Tambahkan periode kalau tersedia


  // Tabel Detail Transaksi
  autoTable(doc, {
    startY: finalY+5,
    head: [['Tanggal', 'Akun', 'Kategori', 'Deskripsi', 'Pemasukan', 'Pengeluaran', 'Saldo']],
    body: report.transactions.map((tx) => [
      new Date(tx.date).toLocaleDateString(),
      tx.account?.name || '-',
      tx.category?.name || '-',
      tx.note || '-',
      tx.type === 'income' ? formatRupiah(tx.amount) : '',
      tx.type === 'expense' ? formatRupiah(tx.amount) : '',
      formatRupiah(tx.balance),
    ]),
    styles: { fontSize: 9 },
  });

  doc.save(`cashbook-report_from_${formatTanggal(fromDate)}_to_${formatTanggal(toDate)}.pdf`);
};

export const handleExportCSV = (
  report: CashbookReportType,
  fromDate: string,
  toDate: string
) => {
  if (!report) return;

  const totalAllAccount = countTotalAllAccount(report.accounts);

  // Helper to convert array to CSV string (comma separated)
  const toCSV = (rows: (string | number)[][]): string =>
    rows
      .map(row =>
        row
          .map((cell) =>
            typeof cell === 'string' && cell.includes(',')
              ? `"${cell.replace(/"/g, '""')}"`
              : cell
          )
          .join(',')
      )
      .join('\n');

  // === 1. Account Sheet Data ===
  const accountRows = [
    ['Akun', 'Saldo Awal', 'Total Pemasukan', 'Total Pengeluaran', 'Selisih', 'Saldo Akhir'],
    ...report.accounts.map((acc) => [
      acc.name || '-',
      acc.startBalance,
      acc.totalIncome,
      acc.totalExpense,
      acc.totalIncome - acc.totalExpense,
      acc.currentBalance,
    ]),
    [
      'Total',
      totalAllAccount.startBalance,
      totalAllAccount.income,
      totalAllAccount.expense,
      totalAllAccount.different,
      totalAllAccount.currentBalance,
    ],
  ];

  // === 2. Transaction Sheet Data ===
  const transactionRows = [
    ['Tanggal', 'Akun', 'Kategori', 'Deskripsi', 'Pemasukan', 'Pengeluaran', 'Saldo'],
    ...report.transactions.map((tx) => [
      new Date(tx.date).toLocaleDateString(),
      tx.account?.name || '-',
      tx.category?.name || '-',
      tx.note || '-',
      tx.type === 'income' ? tx.amount : '',
      tx.type === 'expense' ? tx.amount : '',
      tx.balance,
    ]),
  ];

  // Convert each to CSV text
  const accountCSV = toCSV(accountRows);
  const transactionCSV = toCSV(transactionRows);

  // Combine them with a separator (optional)
  const combinedCSV = `=== Data Akun ===\n${accountCSV}\n\n=== Data Transaksi ===\n${transactionCSV}`;

  // Create a downloadable Blob
  const blob = new Blob([combinedCSV], { type: 'text/csv;charset=utf-8;' });

  // Create a link to trigger download
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;

  // Filename with dates
  const filename = `cashbook-report_${fromDate}_to_${toDate}.csv`;
  link.setAttribute('download', filename);

  // Append to DOM and trigger click
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function CashbookExportButton({report, fromDate, toDate}: {report: CashbookReportType, fromDate: string, toDate: string}) {
  const [exportType, setExportType] = useState<"pdf" | "excel">("pdf");

 const exportOptions: { label: string; value: "pdf" | "excel" }[] = [
  { label: "PDF", value: "pdf" },
  { label: "Excel", value: "excel" },
];

  const handleExport = (type:  "pdf" | "excel") => {
    setExportType(type);
    if (type === "pdf") handleExportPdf(report, fromDate, toDate);
    else handleExportCSV(report, fromDate, toDate);
  };

  return (
   <div className="flex justify-end items-center mb-4 gap-3">
       <DropdownButton
          options={exportOptions}
          value={exportType}
          onChange={(val: "pdf" | "excel") => handleExport(val)}
          buttonLabel="Export as"
        />
      </div>

  )
}