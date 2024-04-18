import React, { useContext } from 'react';
import useReducerFetch, { FetchStateProps } from './useReducerFetch.js'
import axios from 'axios';
import { useFetcher } from "@remix-run/react";
import { PagingContext } from '../contexts/Paging.js'
import useEffect from './useEffect.js'

export default function useFetch<T>(props):[FetchStateProps, (url, params?) => Promise<T[]>] {
  const [page_info, previous_page_info, next_page_info, setPageInfo, setPreviousPageInfo, setNextPageInfo] = useContext(PagingContext)

  const initialState = {loading: false, error: null}
  const [state, onFetch, onSuccess, onError] = useReducerFetch(props, initialState);
  const fetcher = useFetcher()

  const fetch = async (url, params?):Promise<T[]> => {
    if (!url) {
      return
    }
    onFetch();
    try {
      let response;
      if (params) {
        const urlObj = new URL(url)
        for (var key in params){
          url.searchParams.set(key, params[key]);
        }
        response = await fetcher.load(urlObj.toString());
      } else {
        response = await fetcher.load(url);
      }
      let newItems:T[] = response.data && response.data.items || response.data
      console.debug(`${url} : fetched ${newItems.length}`)
      setPreviousPageInfo(response.data.previous_page_info)
      setNextPageInfo(response.data.next_page_info)
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