import React, { useState, useRef } from 'react';
import Form, {FormProps} from '../models/Form.js'

type FormContextType = FormProps
const FormContext = React.createContext<FormContextType>({} as FormProps);

const FormProvider = (props) => {
  const form = Form(props)

  return (
    <FormContext.Provider value={form}>
      {props.children}
    </FormContext.Provider>
  );
};

export { FormContext, FormProvider}
