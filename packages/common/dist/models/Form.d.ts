export interface FormProps {
    rootName: string;
    data: any;
    errors: string[];
    field: (name: any) => any;
    onData: (name: any) => (payload: any) => void;
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
    format: (name: any) => any;
    scope?: string;
    data?: Record<string, any>;
};
export default function Form(props: Props): FormProps;
export {};
