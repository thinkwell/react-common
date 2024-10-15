import { useContext, useRef } from 'react';
import { SearchContext } from '../contexts/Search.js';
import { SortContext } from '../contexts/Sort.js';
import debounce from 'lodash/debounce.js';
export default function useSearch(fetch) {
    const [search, setSearch] = useContext(SearchContext);
    const [sort, setSort] = useContext(SortContext);
    const onSearch = (params) => {
        if (!params.order && !!sort) {
            params.order = sort;
        }
        if (!params.query && !!search) {
            params.query = search;
        }
        fetch(params);
    };
    const delayedSearch = useRef(debounce(onSearch, 1000));
    const onSearchChange = (value) => {
        console.log(`useSearch#onSearchChange : ${sort} : ${search} : ${value}`);
        setSearch(value);
        delayedSearch.current({ query: value });
    };
    const onSortChange = (value) => {
        setSort(value);
        onSearch({ order: value });
    };
    return [onSearchChange, onSortChange, onSearch];
}
