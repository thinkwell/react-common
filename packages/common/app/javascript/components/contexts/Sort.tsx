import React, { useState } from 'react';
import Util from '../Util.js'

type SortContextType = [sort: string, setSort: (string) => void]

const SortContext = React.createContext<SortContextType>(["", () => {}]);

const SortProvider = (props) => {
  const value = props && props.sort
  const [sort, setSort] = useState<string>(value)

  return (
    <SortContext.Provider value={[sort, setSort]}>
      {props.children}
    </SortContext.Provider>
  );
};

export { SortContext, SortProvider}
