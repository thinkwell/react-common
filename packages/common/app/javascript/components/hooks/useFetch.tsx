import React, { useContext } from 'react';
import useReducerFetch, { FetchStateProps } from './useReducerFetch.js'
import { PagingContext } from '../contexts/Paging.js'
import useApi from './useApi.js'
import useEffect from './useEffect.js'

export default function useFetch<T>(props):[FetchStateProps, (url, params?) =>Promise<T[]>] {
  const [page_info, previous_page_info, next_page_info, setPageInfo, setPreviousPageInfo, setNextPageInfo] = useContext(PagingContext)

  const initialState = {loading: false, error: null}
  const [state, onFetch, onSuccess, onError] = useReducerFetch(props, initialState);
  const api = useApi();

  const fetch = async(url, params?):Promise<T[]> => {
    if (!url) {
      return
    }
    onFetch();
    try {
      let response;
      if (params) {
        const searchParams = new URLSearchParams()
        for (const key in params) {
          let value = params[key]
          if (typeof value != 'string') {
            value = JSON.stringify(value)
          }
          searchParams.set(key, value)
        }
        url = `${url}?${searchParams.toString()}`
      }
      response = await api({method: 'get', url: url});

      let newItems:T[] = response.data && response.data.items || response.data || response
      console.debug(`${url} : fetched ${newItems.length}`)
      setPreviousPageInfo(response.previous_page_info)
      setNextPageInfo(response.next_page_info)
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