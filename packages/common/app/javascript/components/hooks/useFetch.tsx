import React, { useContext } from 'react';
import useReducerFetch, { FetchStateProps } from './useReducerFetch.js'
import { PagingContext } from '../contexts/Paging.js'
import api from '../services/api.js'
import useEffect from './useEffect.js'

export default function useFetch<T>(props):[FetchStateProps, (url, params?) =>Promise<T[]>] {
  const [page_info, previous_page_info, next_page_info, setPageInfo, setPreviousPageInfo, setNextPageInfo] = useContext(PagingContext)

  const initialState = {loading: false, error: null}
  const [state, onFetch, onSuccess, onError] = useReducerFetch(props, initialState);

  const fetch = async(url, params?):Promise<T[]> => {
    if (!url) {
      return
    }
    onFetch();
    try {
      let data;
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
      data = await api({method: 'get', url: url});

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