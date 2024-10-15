import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import Util from '../Util.js';
const SortContext = React.createContext(["", () => { }]);
const SortProvider = (props) => {
    const value = props && props.sort || !(typeof document === "undefined") && Util.getParam(window.location.href, 'sort') || '';
    const [sort, setSort] = useState(value);
    return (_jsx(SortContext.Provider, { value: [sort, setSort], children: props.children }));
};
export { SortContext, SortProvider };
