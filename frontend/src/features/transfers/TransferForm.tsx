"use client";
import * as Yup from "yup";
import { Formik, Form, Field, FieldProps, ErrorMessage,  } from "formik";
import { useState } from "react";

import FormWrapper from "@/components/form/FormWrapper";
import FormTitle from "@/components/form/FormTitle";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import Button from "@/components/ui/buttons/Button";
import Alert from '@/components/ui/alert/Alert';
import { Transfer }  from "./TransferInterface";
import api, {handleApiError} from "@/lib/api";
import TransactionAccountSelect from "../transactions/TransactionAccountSelect";

export const TransferValidationSchema = Yup.object({
    fromAccount: Yup.string().required("Account is required"),
    toAccount: Yup.string().required("Account is required"),
    date: Yup.date().required("Date is required"),
    note: Yup.string().required("Note is required").min(5, "Note must be at least 5 characters"),
    amount: Yup.number().required("Amount is required").min(0, "Amount must be a positive number"),
});

export const typeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export type TransferFormProps = {
    mode: "Create" | "Edit",
    transfer?: Transfer,
    onSaved: (transfer: Transfer) => void
}


export default function TransferForm({ mode, transfer, onSaved} : TransferFormProps) {
    const [submitError, setSubmitError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const initialValues = {
        fromAccount: transfer?.fromAccount?._id || "",
        toAccount: transfer?.toAccount?._id || "",
        amount: transfer?.amount || 0,
        date: transfer?.date || new Date().toISOString(),
        note: transfer?.note || "",
    };

    const handleSubmit = async (values: typeof initialValues) => {
        const amount = Number(values.amount);
        values.amount = amount;
        try {
            setSubmitError("");
            let response;
            if(mode == 'Create'){
                response = await api.post<Transfer>("/transfers", values);
                console.log(values);
            }else{
                response = await api.put<Transfer>(`/transfers/${transfer?._id}`, values);
            }
            onSaved(response.data);
            setIsSuccess(true);
        } catch (err: unknown) {
            console.error('error', err);
            const apiError = handleApiError(err);
            const errorMessage = Array.isArray(apiError) ? apiError.join(", ") : apiError;
            setSubmitError(errorMessage);
        }
    };

    return (
        <FormWrapper>
            <FormTitle title={mode+" Transfer"}/>
            <Formik
                initialValues={initialValues}
                validationSchema={TransferValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-5">
                        {isSuccess && (
                            <Alert
                                variant="success"
                                title="Success"
                                message={mode=='Create'? 'Create Transfer Success!' :  'Update Transfer Success!'}
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
                              <Field name="fromAccount">
                                {({ field, form } : FieldProps) => (
                                    <TransactionAccountSelect
                                        label="From Account"
                                        placeholder="Select From Account"
                                        value={field.value}
                                        onChange={(value: string) => {
                                            form.setFieldValue(field.name, value);
                                        }}
                                    />
                                )}
                                </Field>
                                <ErrorMessage
                                    name="fromAccount"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                        </div>

                         <div>
                              <Field name="toAccount">
                                {({ field, form } : FieldProps) => (
                                    <TransactionAccountSelect
                                        label="To Account"
                                        placeholder="Select To Account"
                                        value={field.value}
                                        onChange={(value: string) => {
                                            form.setFieldValue(field.name, value);
                                        }}
                                    />
                                )}
                                </Field>
                                <ErrorMessage
                                    name="toAccount"
                                    component="div"
                                    className="text-sm text-red-500 mt-1"
                                />
                        </div>

                      
                        
                        <div>
                            <Label htmlFor="type">
                                Date<span className="text-error-500">*</span>
                            </Label>
                            <Field name="date">
                                {({ field, form } : FieldProps) => (
                                    <DatePicker
                                        id="date"
                                        placeholder="Enter Date"
                                        defaultDate={field.value}
                                        onChange={(dates: Date[]) => {
                                            const value = dates.length > 0 ? dates[0].toISOString() : "";
                                            form.setFieldValue(field.name, value);
                                        }}
                                    />
                                )}
                            </Field>
                            <ErrorMessage
                                name="date"
                                component="div"
                                className="text-sm text-red-500 mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="note">
                                Note<span className="text-error-500">*</span>
                            </Label>
                            <Field
                                as={Input}
                                name="note"
                                id="note"
                                placeholder="Enter Note"
                            />
                            <ErrorMessage
                                name="note"
                                component="div"
                                className="text-sm text-red-500 mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="name">
                                Amount<span className="text-error-500">*</span>
                            </Label>
                            <Field
                                as={Input}
                                name="amount"
                                id="amount"
                                placeholder="Enter Amount"
                            />
                            <ErrorMessage
                                name="amount"
                                component="div"
                                className="text-sm text-red-500 mt-1"
                            />
                        </div>
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
