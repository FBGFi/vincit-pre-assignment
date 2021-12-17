import React from 'react';

type FormInputProps = {
    children: JSX.Element;
    title: string;
    id: string;
}

const FormInput: React.FC<FormInputProps> = (props) => {
    return (
        <>
            <label htmlFor={props.id}>{props.title}</label>
            {props.children}
        </>
    );
}

export default FormInput;