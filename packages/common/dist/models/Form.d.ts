export interface FormProps {
    rootName: string;
    data: () => any;
    errors: () => string[];
    field: (name: string | string[]) => any;
    onData: (name: string | string[]) => (payload: any) => void;
    setChild: (name: string, form: FormProps) => void;
    register: (name: string | string[], validator: any) => void;
}
type ParentProps = {
    setChild: (name: string, object: any) => void;
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
