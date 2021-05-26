import React, { useState, useRef } from 'react';
import Util from '../Util'

const SearchContext = React.createContext(["", () => {}]);

const SearchProvider = (props) => {
  const value = props && props.search || Util.getParam(window.location.href, 'query') || ''
  const [search, setSearch] = useState(value)

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {props.children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider}
