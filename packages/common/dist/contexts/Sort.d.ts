import React from 'react';
type SortContextType = [sort: string, setSort: (string: any) => void];
declare const SortContext: React.Context<SortContextType>;
declare const SortProvider: (props: any) => import("react/jsx-runtime").JSX.Element;
export { SortContext, SortProvider };
