import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext } from 'react';
import { Select as SelectPolaris, LegacyStack } from '@shopify/polaris';
import Spinner from './Spinner.js';
import { FormContext } from '@thinkwell/react.common';
import startCase from 'lodash/startCase.js';
export default function Select(props) {
    if (!props.name) {
        throw `Property name is required for Select ${props.label.singular || props.label}`;
    }
    const form = useContext(FormContext);
    const onChange = (value) => {
        form.onData(props.name)(value);
        props.onChange && props.onChange(value, form);
    };
    const validate = () => {
        console.log(`------------- Select::validate(${props.name}) : ${props.required} : ${form.field(props.name)}`);
        if (props.required && !form.field(props.name)) {
            return { [props.name]: "Required " + (props.label.singular || props.label) };
        }
        return {};
    };
    form.register(props.name, validate);
    const selectEl = _jsx(SelectPolaris, { label: startCase(props.label.plural || props.label), labelInline: typeof props.labelInline !== 'undefined' ? props.labelInline : true, options: props.options, onChange: onChange, value: form.field(props.name), error: props.fetchState && props.fetchState.error });
    return typeof props.labelInline !== 'undefined' && !props.labelInline ? selectEl : (_jsxs(LegacyStack, { children: [props.options && props.options.length || props.fetchState && props.fetchState.error ?
                _jsx(LegacyStack.Item, { fill: true, children: selectEl }) :
                props.fetchState && !props.fetchState.loading ? _jsx("div", { children: props.notFoundMessage || `No ${props.label.plural || props.label} found` }) : null, props.fetchState && props.fetchState.loading ? _jsx(Spinner, { active: props.fetchState.loading }) : null] }));
}
