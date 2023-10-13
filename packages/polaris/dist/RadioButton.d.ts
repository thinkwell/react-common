import { FormProps } from '@thinkwell/react.common';
type Props = {
    name: string | string[];
    label?: string;
    id?: string;
    value?: string;
    onChange(value: string, form: FormProps): any;
};
export default function RadioButton(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
