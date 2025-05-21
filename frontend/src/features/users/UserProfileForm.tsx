import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import axios from "axios";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Alert from '@/components/ui/alert/Alert';
import { User } from "./UserInterface";
import api from "@/lib/api";


const UpdateProfileValidationSchema = Yup.object({
    name: Yup.string().required().min(5),
    email: Yup.string().email("Invalid email").required("Email is required"),
});


export default function UserProfileForm({ user, onSuccess }: { user: User; onSuccess: (updatedUser:User) => void }) {
    const [submitError, setSubmitError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const initialValues = {
        email: user.email,
        name: user.name,
    };

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            setSubmitError("");
            const response = await api.put<User>("/users/update-profile", values);
            onSuccess(response.data);
            setIsSuccess(true);
        } catch (err: unknown) {
             if(axios.isAxiosError(err)){
                if(err.response){   
                    setIsSuccess(false);
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
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Edit Profile
                </h4>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                    Update User Profile
                </p>
            </div>

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
                                message="Update profile success!"
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
                            <Label htmlFor="email">
                                Email<span className="text-error-500">*</span>
                            </Label>
                            <Field
                                as={Input}
                                disabled
                                type="email"
                                name="email"
                                id="email"
                            />
                        </div>

                        <div>
                            <Label htmlFor="name">
                                Name<span className="text-error-500">*</span>
                            </Label>
                            <Field
                                as={Input}
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

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button disabled = {isSubmitting} isLoading={isSubmitting}>
                                Save
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
