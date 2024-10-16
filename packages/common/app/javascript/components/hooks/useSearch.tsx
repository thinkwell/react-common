import React, { useContext, useRef } from 'react';
import { SearchContext } from '../contexts/Search.js'
import { SortContext } from '../contexts/Sort.js'
import debounce from 'lodash/debounce.js';

export default function useSearch (fetch):[(value:string) => void, (value:string) => void, (params:any) => void] {
  const [search, setSearch] = useContext(SearchContext);
  const [sort, setSort] = useContext(SortContext);

  const onSearch = (params) => {
    if (!("order" in params) && !!sort) {
      params.order = sort 
    }
    if (!("query" in params) && !!search) {
      params.query = search 
    }
    fetch(params)
  }

  const delayedSearch = useRef(debounce(onSearch, 1000));

  const onSearchChange = (value:string) => {
    setSearch(value)
    const params:any = {query: value}
    if (!!sort) {
      params.order = sort
    }
    delayedSearch.current(params)
  }

  const onSortChange = (value:string) => {
    setSort(value)
    onSearch({order: value})
  }

  return [onSearchChange, onSortChange, onSearch]
}
