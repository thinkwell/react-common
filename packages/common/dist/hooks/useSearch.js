import { useContext, useRef } from 'react';
import { SearchContext } from '../contexts/Search.js';
import { SortContext } from '../contexts/Sort.js';
import debounce from 'lodash/debounce.js';
export default function useSearch(fetch) {
    const [search, setSearch] = useContext(SearchContext);
    const [sort, setSort] = useContext(SortContext);
    const onSearch = (params) => {
        if (sort) {
            params.order || (params.order = sort);
        }
        if (search) {
            params.query || (params.query = search);
        }
        fetch(params);
    };
    const delayedSearch = useRef(debounce(onSearch, 1000));
    const onQueryChange = (value) => {
        setSearch(value);
        delayedSearch.current({ query: value });
    };
    const onSortChange = (value) => {
        setSort(value);
        onSearch({ order: value });
    };
    return [onQueryChange, onSortChange, onSearch];
}
