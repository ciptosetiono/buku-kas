import * as Yup from "yup";
import { Formik, Form, Field, FieldProps, ErrorMessage,  } from "formik";
import { useState } from "react";

import FormWrapper from "@/components/form/FormWrapper";
import FormTitle from "@/components/form/FormTitle";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Button from "@/components/ui/buttons/Button";
import Alert from '@/components/ui/alert/Alert';
import { Category }  from "./CategoryInterface";
import api, {handleApiError} from "@/lib/api";


const CategoryValidationSchema = Yup.object({
    name: Yup.string().required().min(5),
    type: Yup.string(),
});

export const typeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export type AccountFormProps = {
    mode: "Create" | "Edit",
    category?: Category,
    onSaved: (category: Category) => void
}

export default function CategoryForm({ mode, category, onSaved} : AccountFormProps) {
    const [submitError, setSubmitError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const initialValues = {
        name: category?.name || "",
        type: category?.type || "expense",
    };

    const handleSubmit = async (values: typeof initialValues) => {
        setIsLoading(true);
        try {
            setSubmitError("");
            let response;
            if(mode == 'Create'){
                response = await api.post<Category>("/categories", values);
            }else{
                response = await api.put<Category>(`/categories/${category?._id}`, values);
            }
            console.log(response);
            onSaved(response.data);
            setIsSuccess(true);
        } catch (err: unknown) {
            const apiError = handleApiError(err);
            const errorMessage = Array.isArray(apiError) ? apiError.join(", ") : apiError;
            setSubmitError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FormWrapper>
            <FormTitle title={mode+" Category"}/>
            <Formik
                initialValues={initialValues}
                validationSchema={CategoryValidationSchema}
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
                                placeholder="Enter category name"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-sm text-red-500 mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="type">
                                Type<span className="text-error-500">*</span>
                            </Label>
                            <Field name="type">
                                {({ field, form } : FieldProps) => (
                                    <Select
                                        id="type"
                                        placeholder="Select Type"
                                        value={field.value}
                                        onChange={(value: string) => form.setFieldValue(field.name, value)}
                                        options={typeOptions}
                                    />
                                )}
                            </Field>
                            <ErrorMessage
                                name="type"
                                component="div"
                                className="text-sm text-red-500 mt-1"
                            />
                        </div>

                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                            <Button
                                type="submit"
                                color={mode=='Create'? 'green': 'blue'}
                                disabled={isSubmitting}
                                isLoading={isLoading}
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
