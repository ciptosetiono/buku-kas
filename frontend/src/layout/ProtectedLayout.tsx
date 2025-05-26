// app/(protected)/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () =>{
        try {
            const res = await api.get("/auth/validate");
            if (res.status !== 200) {
                router.push("/auth/signin");
            } else {
                setLoading(false);
            }

        }catch(err: unknown){
            console.log('err', err);
            router.push("/auth/signin");
        }   
    }
    validateToken();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
