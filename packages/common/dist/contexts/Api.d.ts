import React from 'react';
type ApiContextType = [useFetcher: boolean, setUseFetcher: (string: any) => void];
declare const ApiContext: React.Context<ApiContextType>;
declare const ApiProvider: (props: any) => import("react/jsx-runtime").JSX.Element;
export { ApiContext, ApiProvider };
