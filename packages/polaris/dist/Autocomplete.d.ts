import { TextFieldProps } from '.';
type Props = TextFieldProps & {
    formatLabel?: (string: any) => string;
    valueProp?: string;
    url: string;
    limit?: string;
    idProp?: string;
};
export default function Autocomplete(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
