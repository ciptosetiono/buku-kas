"use client";

import { logout } from "@/features/auth/authService";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";

export const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const handleLogout = async () => {
        setIsLoading(true);
        const isLogout: boolean = await logout();
        if(isLogout){
            window.location.href = '/auth/signin'; //
        }
        setIsLoading(false);
    };

    return (
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
            <LogOutIcon/>
            { isLoading ? "Loading..." :  "Sign out"}
        </button>
    )
}
