import React, { useState, useRef } from 'react';
import Form from '../models/Form'

const FormContext = React.createContext([{}]);

const FormProvider = (props) => {
  const form = new Form(props)

  return (
    <FormContext.Provider value={form}>
      {props.children}
    </FormContext.Provider>
  );
};

export { FormContext, FormProvider}
