"use client";
import * as Yup from "yup";
import { Formik, Form, Field, FieldProps} from "formik";
import { useState } from "react";
import FormWrapper from "@/components/form/FormWrapper";
import FormTitle from "@/components/form/FormTitle";
import Input from "@/components/form/input/InputField";
import NumberInput from "@/components/form/input/NumberInput";
import DatePicker from "@/components/form/date-picker";
import ErrorMessage from "@/components/form/ErrorMessage";
import Label from "@/components/form/Label";
import RequiredMark from "@/components/form/RequiredMark";
import Button from "@/components/ui/buttons/Button";
import Alert from '@/components/ui/alert/Alert';
import { Transaction }  from "./TransactionInterface";
import api, {handleApiError} from "@/lib/api";
import TransactionCategorySelect from "./TransactionCategorySelect";
import { CategoryType } from "../categories/CategoryInterface";
import { TransactionAccountSelect } from "./TransactionAccountSelect";

export const TransactionValidationSchema = Yup.object({
    note: Yup.string().required("Note is required").min(5, "Note must be at least 5 characters"),
    account: Yup.string().required("Account is required"),
    category: Yup.string().required("Category is required"),
    type: Yup.string().required("Type is required"),
    amount: Yup.number().required("Amount is required").min(0, "Amount must be a positive number"),
    date: Yup.date().required("Date is required"),
});

export const typeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export type TransactionFormProps = {
    mode: "Create" | "Edit",
    transaction?: Transaction,
    onSaved: (transaction: Transaction) => void
}


export default function TransactionForm({ mode, transaction, onSaved} : TransactionFormProps) {

    const [submitError, setSubmitError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const initialValues = {
        note: transaction?.note || "",
        category: transaction?.category?._id || "",
        account: transaction?.account?._id || "",
        type: transaction?.type || "",
        amount: transaction?.amount || 0,
        date: transaction?.date || new Date().toISOString(),
    };

    const handleSubmit = async (values: typeof initialValues) => {
        const amount = Number(values.amount);
        values.amount = amount;
        try {
            setSubmitError("");
            let response;
            if(mode == 'Create'){
                response = await api.post<Transaction>("/transactions", values);
            }else{
                response = await api.put<Transaction>(`/transactions/${transaction?._id}`, values);
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
            <FormTitle title={mode+" Transaction"}/>
            <Formik
                initialValues={initialValues}
                validationSchema={TransactionValidationSchema}
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
                            <Label htmlFor="type">
                                Type
                            </Label>
                           <Field
                                as={Input}
                                name="type"
                                id="type"
                                disabled
                            />
                            <ErrorMessage name="type"/>
                        </div>

                         <div>
                              <Field name="account">
                                {({ field, form } : FieldProps) => (
                                    <TransactionAccountSelect
                                        value={field.value}
                                        onChange={(value: string) => {
                                            form.setFieldValue(field.name, value);
                                        }}
                                    />
                                )}
                                </Field>
                                <ErrorMessage name="account"/>
                        </div>

                        <div>
                              <Field name="category">
                                {({ field, form } : FieldProps) => (
                                    <TransactionCategorySelect
                                        type={transaction?.type as unknown as CategoryType}
                                        value={field.value}
                                        onChange={(value: string) => {
                                            form.setFieldValue(field.name, value);
                                        }}
                                    />
                                )}
                                </Field>
                                <ErrorMessage name="category"/>
                        </div>
                        
                        <div>
                            <Label htmlFor="type">
                                Date <RequiredMark/>
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
                            <ErrorMessage name="date"/>
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
                            />
                        </div>
                        <div>
                            <Label htmlFor="amount">
                                Amount <RequiredMark/>
                            </Label>
                            <Field name="amount">
                                {({ field, form }: FieldProps) => (
                                <NumberInput
                                    value={field.value}
                                    onValueChange={(val) => form.setFieldValue(field.name, val)}
                                />
                                )}
                            </Field>
                            <ErrorMessage name="amount"/>
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
