import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { useSearch, SortContext } from '@thinkwell/react.common';
import { Select } from '@shopify/polaris';
export default function SortSelect(props) {
    const [sort] = useContext(SortContext);
    const field = props.field || 'updated_at';
    const onSearch = props.onSearch || function () { };
    const [onSearchChange, onSortChange] = useSearch(onSearch);
    const options = props.options || [{
            label: 'Newest update',
            value: `${field} desc`
        }, {
            label: 'Oldest update',
            value: `${field} asc`
        }];
    return (_jsx(Select, { label: "Sort by", labelInline: true, options: options, onChange: onSortChange, value: sort }));
}
