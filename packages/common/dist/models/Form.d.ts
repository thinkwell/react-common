export default function Form(props: any): {
    field: (name: any) => any;
    readonly data: any;
    readonly errors: any;
    onData: (name: any) => any;
    register: (name: any, validator: any) => void;
    setChild: (name: any, form: any) => void;
    rootName: any;
};
