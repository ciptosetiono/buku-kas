import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import axios from "axios";
import FormWrapper from "@/components/form/FormWrapper";
import FormTitle from "@/components/form/FormTitle";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/buttons/Button";
import Alert from '@/components/ui/alert/Alert';
import Account  from "./accountInterface";
import api from "@/lib/api";


const CreateAccountValidationSchema = Yup.object({
    name: Yup.string().required().min(5),
    balance: Yup.number(),
});

const EditAccountValidationSchema = Yup.object({
    name: Yup.string().required().min(5)
});



export type AccountFormProps = {
    mode: "Create" | "Edit",
    account?: Account,
    onSaved: (account: Account) => void
}

export default function AccountForm({ mode, account, onSaved} : AccountFormProps) {
    const [submitError, setSubmitError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const initialValues = {
        name: account?.name || "",
        balance: account?.balance || 0,
    };

    const handleSubmit = async (values: typeof initialValues) => {
        console.log("values", values);
        try {
            setSubmitError("");
            let response;
            if(mode == 'Create'){
                response = await api.post<Account>("/accounts", values);
            }else{
                response = await api.put<Account>(`/accounts/${account?._id}`, values);
            }
            onSaved(response.data);
            setIsSuccess(true);
        } catch (err: unknown) {
            setIsSuccess(false);
            if (axios.isAxiosError(err)) {
                if(err.response){
                    const messages = err.response?.data?.message;
                    const msg = Array.isArray(messages) ? messages.join(", ") : messages || "Action failed";
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
            <FormTitle title={mode+" Account"}/>
            <Formik
                initialValues={initialValues}
                validationSchema={mode=='Create' ? CreateAccountValidationSchema: EditAccountValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">
                        {isSuccess && (
                            <Alert
                                variant="success"
                                title="Success"
                                message={mode=='Create'? 'Create Account Success!' :  'Update Account Success!'}
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

                        {mode === 'Create' && (
                            <div>
                                <Label htmlFor="balance">
                                    Initial Balance
                                </Label>
                                <Field
                                    as={Input}
                                    name="balance"
                                    id="balance"
                                    type="number"
                                    placeholder="Enter initial balance"
                                />
                                <ErrorMessage
                                    name="balance"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button
                                type="submit"
                                color={mode=='Create'? 'green': 'blue'}
                                disabled={isSubmitting}
                                isLoading={isSubmitting}
                            >
                                Save
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </FormWrapper> 
    );
}
