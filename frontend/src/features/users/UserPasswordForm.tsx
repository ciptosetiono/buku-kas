"use client"

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import axios from "axios";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert from '@/components/ui/alert/Alert';
import { User } from "./UserInterface";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import api from "@/lib/api";
import FormWrapper from "@/components/form/FormWrapper";
import FormTitle from "@/components/form/FormTitle";


const UpdateProfileValidationSchema = Yup.object({
    password: Yup.string().required().min(8),
});


export default function UpdatePasswordForm({ user, onSaved }: { user: User, onSaved: (user: User) => void}) {
    const [showPassword, setShowPassword] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const initialValues = {
        password: ''
    };

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            setSubmitError("");
            await api.put<User>(`/users/update-password/${user._id}`, values);
            setIsSuccess(true);
            onSaved(user);
        } catch (err: unknown) {
            setIsSuccess(false);
            if(axios.isAxiosError(err)){
                if(err.response){
                    const messages = err?.response?.data?.message;
                    const msg = Array.isArray(messages) ? messages.join(", ") : messages || "Update profile failed";
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
        <FormWrapper>
            <FormTitle title="Edit Password"/>
 
            <Formik
                initialValues={initialValues}
                validationSchema={UpdateProfileValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">
                        {isSuccess && (
                            <Alert
                                variant="success"
                                title="Success"
                                message="Update password success!"
                            />
                        )}
                        {submitError && (
                            <Alert
                                variant="error"
                                title="Error"
                                message={submitError}
                            />
                        )}
                         <div>
                            <Label htmlFor="password">
                               Name
                            </Label>
                            <Input
                                value={user.name}
                                disabled
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">
                               Email
                            </Label>
                            <Input
                                value={user.email}
                                disabled
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

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button disabled={isSubmitting} isLoading={isSubmitting}>
                                Save
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </FormWrapper>
    );
}
