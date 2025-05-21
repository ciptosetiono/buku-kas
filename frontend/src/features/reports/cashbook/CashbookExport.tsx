"use client";

import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
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

export const handleExportExcel = (
  report: CashbookReportType,
  fromDate: string,
  toDate: string
) => {
  if (!report) return;

  const totalAllAccount = countTotalAllAccount(report.accounts);

  // === 1. TABEL DATA AKUN ===
  const accountSheetData = [
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
    ]
  ];

  const accountSheet = XLSX.utils.aoa_to_sheet(accountSheetData);

  // === 2. TABEL TRANSAKSI ===
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
    ])
  ];

  const transactionSheet = XLSX.utils.aoa_to_sheet(transactionRows);

  // === 3. BUKU KERJA ===
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, accountSheet, 'Data Akun');
  XLSX.utils.book_append_sheet(workbook, transactionSheet, 'Data Transaksi');

  // === 4. SIMPAN FILE ===
  XLSX.writeFile(workbook, `cashbook-report_${formatTanggal(fromDate)}_to_${formatTanggal(toDate)}.xlsx`);
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
    else handleExportExcel(report, fromDate, toDate);
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