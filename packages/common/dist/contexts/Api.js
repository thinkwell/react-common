import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
const ApiContext = React.createContext([false, () => { }]);
const ApiProvider = (props) => {
    const [useFetcher, setUseFetcher] = useState(false);
    return (_jsx(ApiContext.Provider, { value: [useFetcher, setUseFetcher], children: props.children }));
};
export { ApiContext, ApiProvider };
