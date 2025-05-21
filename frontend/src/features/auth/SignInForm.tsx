"use client";
import React, { useState} from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "@/lib/api";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/buttons/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { saveAuthData} from "./authService";
import { AuthResponseInterface } from "./authInterface";

export const loginValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});


export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const initialValues = { 
    email: "",
    password: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setSubmitError("");
      const response = await api.post<AuthResponseInterface>("/auth/signin", values);
      await saveAuthData(response.data);
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
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <Formik
              initialValues={initialValues}
              validationSchema={loginValidationSchema}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
              </div>

              <div>
                <Button
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  color="blue"
                  type="submit"
                >
                  Signin
                </Button>
              </div>
            </Form>
            )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
