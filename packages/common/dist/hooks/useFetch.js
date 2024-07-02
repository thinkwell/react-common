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
import { PagingContext } from '../contexts/Paging.js';
import api from '../services/api.js';
import useEffect from './useEffect.js';
export default function useFetch(props) {
    const [page_info, previous_page_info, next_page_info, setPageInfo, setPreviousPageInfo, setNextPageInfo] = useContext(PagingContext);
    const initialState = { loading: false, error: null };
    const [state, onFetch, onSuccess, onError] = useReducerFetch(props, initialState);
    const fetch = (url, params) => __awaiter(this, void 0, void 0, function* () {
        if (!url) {
            return;
        }
        onFetch();
        try {
            let data;
            if (params) {
                const searchParams = new URLSearchParams();
                for (const key in params) {
                    let value = params[key];
                    if (typeof value != 'string') {
                        value = JSON.stringify(value);
                    }
                    searchParams.set(key, value);
                }
                url = `${url}?${searchParams.toString()}`;
            }
            data = yield api({ method: 'get', url: url });
            let newItems = data.items || data;
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
    });
    useEffect(() => {
        fetch(props.url);
    }, []);
    return [state, fetch];
}
