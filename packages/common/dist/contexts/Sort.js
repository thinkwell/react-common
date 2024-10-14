import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
const SortContext = React.createContext(["", () => { }]);
const SortProvider = (props) => {
    const value = props && props.sort;
    const [sort, setSort] = useState(value);
    return (_jsx(SortContext.Provider, { value: [sort, setSort], children: props.children }));
};
export { SortContext, SortProvider };
