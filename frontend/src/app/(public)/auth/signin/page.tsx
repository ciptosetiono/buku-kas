import SignInForm from "@/features/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AAPSI | Aplikasi Akutansi PT STIK Indonesia",
  description: "Login Aplikasi Akutansi PT STIK Indonesia",
};

export default function SignIn() {
  return <SignInForm />;
}
