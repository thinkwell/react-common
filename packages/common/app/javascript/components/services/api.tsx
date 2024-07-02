import { useContext } from 'react';
import axios from 'axios';
import useFetcherWithPromise from '../hooks/useFetcherWithPromise.js'
import { ApiContext } from '../contexts/Api.js'

export default async function(props) {
    const [useFetcher] = useContext(ApiContext)    
    if (useFetcher) {
        const fetcher = useFetcherWithPromise()
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
