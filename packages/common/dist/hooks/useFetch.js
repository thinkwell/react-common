import { useContext } from 'react';
import useReducerFetch from './useReducerFetch.js';
import { useFetcher } from "@remix-run/react";
import { PagingContext } from '../contexts/Paging.js';
import useEffect from './useEffect.js';
export default function useFetch(props) {
    const [page_info, previous_page_info, next_page_info, setPageInfo, setPreviousPageInfo, setNextPageInfo] = useContext(PagingContext);
    const initialState = { loading: false, error: null };
    const [state, onFetch, onSuccess, onError] = useReducerFetch(props, initialState);
    const fetcher = useFetcher();
    const fetch = (url, params) => {
        if (!url) {
            return;
        }
        onFetch();
        try {
            if (params) {
                const urlObj = new URL(url);
                for (var key in params) {
                    url.searchParams.set(key, params[key]);
                }
                fetcher.load(urlObj.toString());
            }
            else {
                fetcher.load(url);
            }
            while (!fetcher.data) { }
            const data = fetcher.data;
            let newItems = data.items;
            console.debug(`${url} : fetched ${newItems.length}`);
            setPreviousPageInfo(data.previous_page_info);
            setNextPageInfo(data.next_page_info);
            onSuccess(newItems);
            return newItems;
        }
        catch (error) {
            console.error(`${url} : fetch failed`, error);
            onError(error);
        }
    };
    useEffect(() => {
        fetch(props.url);
    }, []);
    return [state, fetch];
}
