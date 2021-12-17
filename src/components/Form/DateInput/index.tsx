import React from 'react';
import './DateInput.scss';

import FormInput from 'components/Form/FormInput';
import { TFormField } from '../types';

const DateInput: React.FC<TFormField> = (props) => {
    return (
        <FormInput title={props.title} id={props.id}>
            <input required={props.required} type="date" name={props.name} id={props.id} min={props.min} max={props.max} onChange={props.onChange}/>
        </FormInput>
    );
}

export default DateInput;