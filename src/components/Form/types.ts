type TFormField = {
    name: string;
    id: string;
    title: string;
    formRef: React.RefObject<HTMLFormElement>;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    min?: string | number;
    max?: string | number;
}

export type {TFormField}