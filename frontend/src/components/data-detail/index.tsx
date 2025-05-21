// components/DetailCard.tsx
import React from 'react';

interface DetailCardProps {
  title?: string;
  children:React.ReactNode
}


export const DetailTitle = ({title}: {title: string}) => {
  return(
    <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    );
  }


export const DetailCard = ({ title, children}: DetailCardProps) => {
  return (
    <div className="bg-white shadow rounded-2xl overflow-hidden">
      {title && <DetailTitle title={title}/>}

      <table className="w-full text-sm text-left text-gray-700">
      <tbody>
        {children}
      </tbody>
      </table>
    </div>
  );
};

export const DetailRow = ({label, value} : {label: string, value: string})  => {
    return (
      <tr className="border-b last:border-b-0">
        <th className="px-6 py-3 w-1/3 font-medium text-gray-800 bg-gray-100">{label}</th>
        <td className="px-6 py-3">{value}</td>
      </tr>
    );
}

export default DetailCard;
