import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { SearchContext, SortContext, useSearch } from '@thinkwell/react.common';
import { TextField, Icon, Button } from '@shopify/polaris';
import { SearchIcon, XCircleIcon } from '@shopify/polaris-icons';
export default function SearchTextField(props) {
    const [query] = useContext(SearchContext);
    const [sort] = useContext(SortContext);
    const onSearch = props.onSearch || function () { };
    const [onSearchChange] = useSearch(onSearch);
    const onClear = () => {
        if (!!query) {
            onSearchChange("");
        }
    };
    const onChange = (value) => {
        console.log(`SearchTextField#onChange : ${sort} : ${query} : ${value}`);
        onSearchChange(value);
    };
    return (_jsx("div", { children: _jsx(TextField, { autoComplete: 'off', label: "", labelHidden: true, onChange: onChange, value: query, suffix: _jsx(Button, { onClick: onClear, icon: XCircleIcon, variant: "plain" }), prefix: _jsx(Icon, { source: SearchIcon, tone: "base" }), placeholder: props.placeholder }) }));
}
