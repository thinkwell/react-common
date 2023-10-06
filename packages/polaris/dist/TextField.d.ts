import { TextFieldProps } from '@shopify/polaris';
export type Props = Omit<TextFieldProps, "autoComplete"> & {
    autoComplete?: string;
    format?: (value: any) => string;
    onChange?: (value: any, form: any) => void;
    onEnterPressed?: () => void;
    required: boolean;
};
export default function TextField(props: Props): import("react/jsx-runtime").JSX.Element;
