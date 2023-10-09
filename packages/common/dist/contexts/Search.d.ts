import React from 'react';
type SearchContextType = [search: string, setSearch: (string: any) => void];
declare const SearchContext: React.Context<SearchContextType>;
declare const SearchProvider: (props: any) => import("react/jsx-runtime").JSX.Element;
export { SearchContext, SearchProvider };
