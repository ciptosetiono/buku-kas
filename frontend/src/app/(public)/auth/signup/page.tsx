import { Metadata } from "next";

import SignUpForm from "@/features/auth/SignUpForm";


export const metadata: Metadata = {
  title: "AAPSI",
  description: "Aplikasi Akutansi PT STIK Indonesia",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
