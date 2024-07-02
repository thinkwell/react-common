import { useContext } from 'react';
import axios from 'axios';
import useFetcherWithPromise from './useFetcherWithPromise.js'
import { ApiContext } from '../contexts/Api.js'

export default function useApi():((any) => Promise<any>) {
  const [useFetcher] = useContext(ApiContext)    
  const fetcher = useFetcherWithPromise()
  return async(props) => {
      if (useFetcher) {
          if (props.method =~ /get/i) {
              return await fetcher.load(props.url)
          } else {
              return await fetcher.submit(props.data, props)
          }
      } else {
          const csrfTokenEl:HTMLMetaElement = document.querySelector("meta[name=csrf-token]")
          if (csrfTokenEl) {
            axios.defaults.headers.common['X-CSRF-Token'] = csrfTokenEl.content
          }
          return await axios(props)
      }
  }
}
