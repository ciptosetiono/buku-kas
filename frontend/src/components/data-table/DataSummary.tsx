
'use client';

export type DataSummaryProps = {
    totalItems: number;
    currentCount: number;
    currentPage: number;
    totalPages: number;
    limit:number;
};

export default function DataSummary ({
    totalItems,
    currentCount,
    currentPage,
    limit
} : DataSummaryProps) {

    const start = (currentPage - 1) * limit + 1;
    const end = start + currentCount - 1;

    return (
        <div className="text-sm text-gray-600 mt-2 text-right">
            {totalItems > 0 ? (
                <>Showing {start} - {end} of {totalItems} item{totalItems !== 1 ? 's' : ''}</>
            ) : (
             <>No items to display</>
            )}
        </div>
        );
}