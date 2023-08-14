import React, { useState, useRef } from 'react';
import Util from '../Util'

type SearchContextType = [search: string, setSearch: (string) => void]

const SearchContext = React.createContext<SearchContextType>(["", (string) => {}]);

const SearchProvider = (props) => {
  const value = props && props.search || Util.getParam(window.location.href, 'query') || ''
  const [search, setSearch] = useState<string>(value)

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {props.children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider}
