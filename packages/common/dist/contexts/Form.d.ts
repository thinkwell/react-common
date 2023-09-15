import React from 'react';
import { FormProps } from '../models/Form';
declare const FormContext: React.Context<FormProps>;
declare const FormProvider: (props: any) => JSX.Element;
export { FormContext, FormProvider };
