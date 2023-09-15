import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import Form from '../models/Form';
const FormContext = React.createContext({});
const FormProvider = (props) => {
    const form = Form(props);
    return (_jsx(FormContext.Provider, { value: form, children: props.children }));
};
export { FormContext, FormProvider };
