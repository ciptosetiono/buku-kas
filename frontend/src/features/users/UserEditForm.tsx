"use client";

import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/buttons/Button";
import { User } from "./UserInterface";
import api, {handleApiError} from "@/lib/api";
import FormWrapper from "@/components/form/FormWrapper";
import FormTitle from "@/components/form/FormTitle";

interface UserEditFormProps {
  user: User,
  onSaved: (user: User) => void;
}

const UserEditForm = ({ user, onSaved } : UserEditFormProps) => {
  const [submitError, setSubmitError] = useState("");

  const initialValues = {
    name: user.name,
    email: user.email
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setSubmitError("");
      const response = await api.put<User>(`/users/update/${user._id}`, values);
      onSaved(response.data);
    } catch (err: unknown) {
        const apiError = handleApiError(err);
        const msg = Array.isArray(apiError) ? apiError.join(", ") : apiError;
        setSubmitError(msg);
    }
  };
  return (
    <FormWrapper>
      <FormTitle title={"Edit User"}/>

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
                <Label htmlFor="email">
                  Email<span className="text-error-500">*</span>
                </Label>
                <Field
                  as={Input}
                  type="email"
                  name="email"
                  id="email"
                  disabled
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>


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

export default UserEditForm;