import { SelectProps } from '@shopify/polaris';
import { FetchStateProps } from '@thinkwell/react.common/dist/hooks/useReducerFetch';
export type Props = Omit<SelectProps, "label" | "name" | "onChange"> & {
    name: string;
    required?: boolean;
    label: {
        singular: string;
        plural: string;
    };
    onChange?: (value: any, form: any) => void;
    fetchState?: FetchStateProps;
    notFoundMessage?: string;
};
export default function Select(props: Props): import("react/jsx-runtime").JSX.Element;
