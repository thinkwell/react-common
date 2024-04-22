import React, { useContext } from 'react';
import useReducerFetch, { FetchStateProps } from './useReducerFetch.js'
import axios from 'axios';
import useFetcherWithPromise from "./useFetcherWithPromise.js";
import { PagingContext } from '../contexts/Paging.js'
import useEffect from './useEffect.js'

export default function useFetch<T>(props):[FetchStateProps, (url, params?) =>Promise<T[]>] {
  const [page_info, previous_page_info, next_page_info, setPageInfo, setPreviousPageInfo, setNextPageInfo] = useContext(PagingContext)

  const initialState = {loading: false, error: null}
  const [state, onFetch, onSuccess, onError] = useReducerFetch(props, initialState);
  const fetcher = useFetcherWithPromise()

  const fetch = async(url, params?):Promise<T[]> => {
    if (!url) {
      return
    }
    onFetch();
    try {
      let data;
      if (params) {
        const urlObj = new URL(url)
        for (var key in params){
          url.searchParams.set(key, params[key]);
        }
        data = await fetcher.load(urlObj.toString());
      } else {
        data = await fetcher.load(url);
      }

      let newItems:T[] = data.items || data
      console.debug(`${url} : fetched ${newItems.length}`)
      setPreviousPageInfo(data.previous_page_info)
      setNextPageInfo(data.next_page_info)
      onSuccess(newItems)
      return newItems
    } catch(error) {
      console.error(`${url} : fetch failed`, error)
      onError(error)
    }
  }

  useEffect(() => {
    fetch(props.url)
  }, []);

  return [state, fetch]
}