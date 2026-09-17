import React, { useState } from 'react';

const PagingContext = React.createContext([{}, false, false, () => {}, () => {}, () => {}]);

const PagingProvider = (props) => {
  const [page_info, setPageInfo] = useState(props.page || props.page_info)
  const [previous_page_info, setPreviousPageInfo] = useState(props.previous_page_info)
  const [next_page_info, setNextPageInfo] = useState(props.next_page_info)

  return (
    <PagingContext.Provider value={[page_info, previous_page_info, next_page_info, setPageInfo, setPreviousPageInfo, setNextPageInfo]}>
      {props.children}
    </PagingContext.Provider>
  );
};

export { PagingContext, PagingProvider}
