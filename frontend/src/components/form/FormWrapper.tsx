import React from 'react';

export default function FormWrapper({ children } : {children: React.ReactNode}) {
    return (
        <div className="no-scrollbar relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            {children}
        </div>
    )
}

