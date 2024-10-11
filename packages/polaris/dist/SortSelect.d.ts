import { SelectOption, SelectGroup } from '@shopify/polaris';
type Props = {
    field?: string;
    onSearch: ((params: any) => void);
    options?: (SelectOption | SelectGroup)[];
};
export default function SortSelect(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
