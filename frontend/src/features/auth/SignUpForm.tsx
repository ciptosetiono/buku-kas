"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from "formik";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/buttons/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { saveAuthData } from "./authService";
import { AuthResponseInterface } from "./authInterface";
import api from "@/lib/api";

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setSubmitError("");
      const response = await api.post<AuthResponseInterface>("/auth/signup", values);
      saveAuthData(response.data);
      router.push("/");
    } catch (error: unknown) {
      if(axios.isAxiosError(error)){
        if(error.response){
          const messages = error?.response?.data?.message;
          const msg = Array.isArray(messages) ? messages.join(", ") : messages || "Invalid username or password";
          setSubmitError(msg);
        }else{
            setSubmitError('Network error: Unable to reach the server.');
        }
      }else{
          setSubmitError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {submitError && (
                <div className="p-2 text-sm text-red-600 bg-red-100 rounded">
                  {submitError}
                </div>
              )}

              <div>
                <Label htmlFor="name">
                  Name<span className="text-error-500">*</span>
                </Label>
                <Field
                  as={Input}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">
                  Email<span className="text-error-500">*</span>
                </Label>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  Password<span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Field
                    as={Input}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              <div>
                <Button color="blue" disabled = {isSubmitting} isLoading={isSubmitting}>
                  Signup
                </Button>
              </div>
            </Form>
            )}
          </Formik>
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?
              <Link
                href="/auth/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
