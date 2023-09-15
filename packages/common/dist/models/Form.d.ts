export interface FormProps {
    rootName: string;
    data: string;
    errors: string[];
    field: (name: any) => string;
    onData: (name: any) => Function;
    setChild: (name: any, form: any) => void;
    register: (name: any, validator: any) => void;
}
type ParentProps = {
    setChild: (name: any, object: any) => void;
};
type Props = {
    parent: ParentProps;
    name: string;
    rootName: string;
    omit: string[];
    format: (name: any) => string;
    scope?: string;
    data?: Record<string, string>;
};
export default function Form(props: Props): {
    field: (name: any) => any;
    readonly data: any;
    readonly errors: any;
    onData: (name: any) => any;
    register: (name: any, validator: any) => void;
    setChild: (name: any, form: any) => void;
    rootName: string;
};
export {};
