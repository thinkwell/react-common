import { ReactNode } from 'react';
import { FetchStateProps } from '@thinkwell/react.common';
type Props = {
    fetchItemsLoading?: boolean;
    renderItem: (item: any, id: string, index: number) => ReactNode;
    name?: string | string[];
    limit?: number;
    items: any[];
    onSearch?: ((params?: any) => void);
    resourceName?: {
        singular: string;
        plural: string;
    };
    selectable?: boolean;
    fetchItemsState?: FetchStateProps;
    fetchItemsError?: string;
    filterControl?: ReactNode;
    alternateTool?: ReactNode;
};
export default function ResourceList(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
