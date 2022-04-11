import React, { useContext } from 'react';
import useReducerFetch from './useReducerFetch'
import axios from 'axios';
import { PagingContext } from '../contexts/Paging'
import useEffect from './useEffect'

export default function useFetch (props) {
  const [page_info, previous_page_info, next_page_info, setPageInfo, setPreviousPageInfo, setNextPageInfo] = useContext(PagingContext)

  const initialState = {loading: false, error: null}
  const [state, onFetch, onSuccess, onError] = useReducerFetch(props, initialState);

  const fetch = async (url, params, config) => {
    if (!url) {
      return
    }
    onFetch();
    try {
      let response;
      if (params) {
        response = await axios.get(url, {params});
      } else if (config) {
        response = await axios.get(url, config);
      } else {
        response = await axios.get(url);
      }
      let newItems = response.data && response.data.items || response.data
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
