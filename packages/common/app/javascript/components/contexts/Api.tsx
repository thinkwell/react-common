import React, { useState } from 'react';
import Util from '../Util.js'

type ApiContextType = [useFetcher: boolean, setUseFetcher: (string) => void]

const ApiContext = React.createContext<ApiContextType>([false, () => {}]);

const ApiProvider = (props) => {
  const [useFetcher, setUseFetcher] = useState<boolean>(props.useFetcher)

  return (
    <ApiContext.Provider value={[useFetcher, setUseFetcher]}>
      {props.children}
    </ApiContext.Provider>
  );
};

export { ApiContext, ApiProvider}
