// utils/format.ts

/**
 * Format tanggal ke dalam format Indonesia (cth: 14 Mei 2025)
 * @param date string | Date
 * @returns string
 */
export function formatTanggal(date: string | Date): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getDefaultFromDate(){
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
};

export function getDefaultToDate(){
  return new Date().toISOString();
}


/**
 * Format angka menjadi Rupiah (cth: Rp1.000.000)
 * @param amount number
 * @returns string
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}
