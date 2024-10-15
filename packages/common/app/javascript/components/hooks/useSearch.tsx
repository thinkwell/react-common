import React, { useContext, useRef } from 'react';
import { SearchContext } from '../contexts/Search.js'
import { SortContext } from '../contexts/Sort.js'
import debounce from 'lodash/debounce.js';

export default function useSearch (fetch):[(value:string) => void, (value:string) => void, (params:any) => void] {
  const [search, setSearch] = useContext(SearchContext);
  const [sort, setSort] = useContext(SortContext);

  const onSearch = (params) => {
    if (!params.order && !!sort) {
      params.order = sort 
    }
    if (!params.query && !!search) {
      params.query = search 
    }
    fetch(params)
  }

  const delayedSearch = useRef(debounce(onSearch, 1000));

  const onSearchChange = (value:string) => {
    console.log(`useSearch#onSearchChange : ${sort} : ${search} : ${value}`)
    setSearch(value)
    delayedSearch.current({query: value})
  }

  const onSortChange = (value:string) => {
    setSort(value)
    onSearch({order: value})
  }

  return [onSearchChange, onSortChange, onSearch]
}
