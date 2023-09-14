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
import useReducerFetch from './useReducerFetch';
import axios from 'axios';
import { PagingContext } from '../contexts/Paging';
import useEffect from './useEffect';
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
            let response;
            if (params) {
                response = yield axios.get(url, { params });
            }
            else {
                response = yield axios.get(url);
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
