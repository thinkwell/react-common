import React, { useContext, useRef } from 'react';
import { SearchContext } from '../contexts/Search'
import debounce from 'lodash/debounce';

export default function useSearch (fetch):[(value:string) => void] {
  const [search, setSearch] = useContext(SearchContext);

  const onSearch = (params) => {
    fetch(params)
  }

  const delayedSearch = useRef(debounce(onSearch, 1000));

  const onSearchChange = (value:string) => {
    setSearch(value)
    delayedSearch.current({query: value})
  }

  return [onSearchChange]
}
