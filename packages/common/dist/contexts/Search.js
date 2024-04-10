import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import Util from '../Util';
const SearchContext = React.createContext(["", () => { }]);
const SearchProvider = (props) => {
    const value = props && props.search || !(typeof document === "undefined") && Util.getParam(window.location.href, 'query') || '';
    const [search, setSearch] = useState(value);
    return (_jsx(SearchContext.Provider, { value: [search, setSearch], children: props.children }));
};
export { SearchContext, SearchProvider };
