var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    const fetch = (url, params) => __awaiter(this, void 0, void 0, function* () {
        if (!url) {
            return;
        }
        onFetch();
        try {
            let response;
            if (params) {
                const urlObj = new URL(url);
                for (var key in params) {
                    url.searchParams.set(key, params[key]);
                }
                response = yield fetcher.load(urlObj.toString());
            }
            else {
                response = yield fetcher.load(url);
            }
            let newItems = response.data && response.data.items || response.data;
            console.debug(`${url} : fetched ${newItems.length}`);
            setPreviousPageInfo(response.data.previous_page_info);
            setNextPageInfo(response.data.next_page_info);
            onSuccess(newItems);
            return newItems;
        }
        catch (error) {
            console.error(`${url} : fetch failed`, error);
            onError(error);
        }
    });
    useEffect(() => {
        fetch(props.url);
    }, []);
    return [state, fetch];
}
