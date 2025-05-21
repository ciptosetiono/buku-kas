"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/buttons/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { User } from "./UserInterface";
import api, {handleApiError} from "@/lib/api";
import FormWrapper from "@/components/form/FormWrapper";
import FormTitle from "@/components/form/FormTitle";

interface UserCreateFormProps {
    onSaved: (user: User) => void;
}

const UserCreateForm = ({ onSaved } : UserCreateFormProps) => {
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
      const response = await api.post<User>("/users/create", values);
      onSaved(response.data);
    } catch (err: unknown) {
        const apiError = handleApiError(err);
        const msg = Array.isArray(apiError) ? apiError.join(", ") : apiError;
        setSubmitError(msg);
    }
  };
  return (
    <FormWrapper>
      <FormTitle title={" Create User"}/>

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
                <Button color="green" disabled = {isSubmitting} isLoading={isSubmitting}>
                  Save
                </Button>
              </div>
            </Form>
            )}
          </Formik>
    </FormWrapper>
  );
};

export default UserCreateForm;