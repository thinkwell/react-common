import { CheckboxProps } from '@shopify/polaris/build/ts/src/components/Checkbox';
type Props = Omit<CheckboxProps, "name" | "onChange"> & {
    name: string | string[];
    onChange?: (value: any, FormProps?: any) => void;
};
export default function Checkbox(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
