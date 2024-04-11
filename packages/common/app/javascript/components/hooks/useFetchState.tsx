import React, { useEffect, useState, SetStateAction } from 'react';
import api from '../services/api.js';

type Props = {
  url?: string
}
type UseFetchStateProps<T> = [T, boolean, (string) => Promise<Awaited<T>>]

export default function useFetchState<T>(props?:Props):UseFetchStateProps<T> {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<T>({} as T);

  const fetch = async(url):Promise<Awaited<T>> => {
    setLoading(true)
    setState({} as SetStateAction<T>)
    const result = await api({method: 'get', url: url, headers: {'Content-Type': 'application/json',  'Accept': 'application/json'}, data: {}})
    setLoading(false)
    const data = result && result.data
    setState(data)
    return data
  }
  
  useEffect(() => {
    if (props && props.url) {
      fetch(props.url)
    }
  }, [props && props.url])

  return [state, loading, fetch] as UseFetchStateProps<T>
}
