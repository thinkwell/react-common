import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { Checkbox as CheckboxPolaris } from '@shopify/polaris';
import { FormContext } from '@thinkwell/react.common';
export default function Checkbox(props) {
    if (!props.name) {
        throw `Property name is required for Checkbox ${props.label}`;
    }
    const form = useContext(FormContext);
    const nameHtml = Array.isArray(props.name) ? props.name.join('_') : props.name;
    const id = props.id || nameHtml;
    const onChange = (value) => {
        form.onData(props.name)(value);
        props.onChange && props.onChange(value, form);
    };
    const value = form.field(props.name);
    const checked = value === 'true' || value === true;
    return (_jsx(CheckboxPolaris, { label: props.label, checked: checked, onChange: onChange, value: props.value, onBlur: props.onBlur, onFocus: props.onFocus, name: nameHtml, id: id }));
}
