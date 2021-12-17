import React from 'react';
import './Form.scss';

type FormProps = {
    className?: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const Form = React.forwardRef<HTMLFormElement, React.PropsWithChildren<FormProps>>((props, ref) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSubmit(e);
    }
    return (
        <form
            ref={ref}
            className={props.className || 'Form'}
            onSubmit={onSubmit}>
            {props.children}
            <button type="submit">Submit</button>
        </form>
    );
});

export default Form;