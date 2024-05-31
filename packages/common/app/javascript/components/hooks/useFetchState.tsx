import React, { useEffect, useState, SetStateAction } from 'react';
import useFetcherWithPromise from './useFetcherWithPromise.js';

type Props = {
  url?: string
}
type UseFetchStateProps<T> = [T, boolean, (string) => Promise<Awaited<T>>]

export default function useFetchState<T>(props?:Props):UseFetchStateProps<T> {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<T>({} as T);
  const fetcher = useFetcherWithPromise()

  const fetch = async(url):Promise<Awaited<T>> => {
    setLoading(true)
    setState({} as SetStateAction<T>)
    const result:any = await fetcher.load(url)
    setLoading(false)
    setState(result)
    return result
  }
  
  useEffect(() => {
    if (props && props.url) {
      fetch(props.url)
    }
  }, [props && props.url])

  return [state, loading, fetch] as UseFetchStateProps<T>
}
