import { MutableRefObject, CSSProperties } from 'react';
type Props = {
    url: string | ((form: any) => string);
    submitError?: string;
    submitting?: boolean;
    onSuccess?: (data: any) => void;
    onSubmitting?: (boolean: any) => void;
    onError?: (string: any) => void;
    useHtml?: boolean;
    method?: string | (() => string);
    headers?: any;
    submitRef?: MutableRefObject<(extraData?: any) => void>;
    children?: any;
    submitText?: string;
    submitButton?: string;
    style?: CSSProperties;
};
export default function Form(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
