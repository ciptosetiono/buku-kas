import React, { HTMLAttributes, ReactNode } from "react";

// Table Props
interface TableProps {
  children: ReactNode;
  className?: string;
}

// TableHeader Props
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

// TableBody Props
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

// TableCell Props
interface TableCellProps {
  children: ReactNode;
  colSpan?: number;
  isHeader?: boolean;
  className?: string;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table
        className={`min-w-full border-collapse text-sm ${className}`}
      >
        {children}
      </table>
    </div>
  );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead className={`border-b ${className}`}>
      {children}
    </thead>
  );
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return (
    <tbody className={`divide-y divide-gray-100 ${className}`}>
      {children}
    </tbody>
  );
};


// TableRow Component
const TableRowHeader: React.FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr className={`${className}`}>
      {children}
    </tr>
  );
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr className={`${className}`}>
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  colSpan,
  className,
}) => {
  const baseClasses =
    "px-5 py-3 text-start text-sm font-medium text-gray-700";
  if (isHeader) {
    return (
      <th className={`${baseClasses} ${className}`} colSpan={colSpan? colSpan : undefined}> 
        {children}
      </th>
    );
  }
  return <td className={`${baseClasses} ${className}`} colSpan={colSpan? colSpan : undefined}>{children}</td>;
};

export { Table, TableHeader, TableBody, TableRowHeader, TableRow, TableCell };
