import { ReactNode } from 'react';
import { FetchStateProps } from '@thinkwell/react.common';
type Props = {
    fetchItemsLoading?: boolean;
    renderItem: (item: any, id: string, index: number) => ReactNode;
    name?: string | string[];
    order?: string;
    limit?: number;
    items: any[];
    withoutSort?: boolean;
    url?: string;
    fetchItems?: ((url: string, params?: any) => void);
    resourceName?: {
        singular: string;
        plural: string;
    };
    selectable?: boolean;
    fetchItemsState?: FetchStateProps;
    fetchItemsError?: string;
    filterControl?: ReactNode;
};
export default function ResourceList(props: Props): import("react/jsx-runtime").JSX.Element;
export {};
