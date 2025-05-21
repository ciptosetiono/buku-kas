// components/PageLayout.tsx
import React from 'react';
import PageTitle from './PageTitle';

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {title && <PageTitle title={title}/>}
        <div className="bg-white shadow rounded-2xl p-6">{children}</div>
      </div>
    </div>
  );
};

export default PageLayout;
