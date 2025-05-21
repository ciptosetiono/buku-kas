export enum CategoryType {
    Income = 'income',
    Expense = 'expense',
}

export interface Category {
    _id: string;
    name: string;
    type: CategoryType;
}
