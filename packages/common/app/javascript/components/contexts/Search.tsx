import React, { useState } from 'react';
import Util from '../Util.js'

type SearchContextType = [search: string, setSearch: (string) => void]

const SearchContext = React.createContext<SearchContextType>(["", () => {}]);

const SearchProvider = (props) => {
  const value = props && props.search || !(typeof document === "undefined") && Util.getParam(window.location.href, 'query') || ''
  const [search, setSearch] = useState<string>(value)

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {props.children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider}
