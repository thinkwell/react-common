import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { SearchContext, useSearch } from '@thinkwell/react.common';
import { TextField, Icon } from '@shopify/polaris';
import { SearchIcon, XCircleIcon } from '@shopify/polaris-icons';
export default function SearchTextField(props) {
    const [query] = useContext(SearchContext);
    const onSearch = props.onSearch || function () { };
    const [onSearchChange] = useSearch(onSearch);
    const onClear = () => {
        if (!!query) {
            onSearchChange("");
        }
    };
    return (_jsx("div", { children: _jsx(TextField, { autoComplete: 'off', label: "", labelHidden: true, onChange: onSearchChange, value: query, suffix: _jsx("div", { onClick: onClear, children: _jsx(Icon, { source: XCircleIcon, tone: "base" }) }), prefix: _jsx(Icon, { source: SearchIcon, tone: "base" }), placeholder: props.placeholder }) }));
}
