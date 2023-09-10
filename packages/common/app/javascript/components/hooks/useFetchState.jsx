import React, { useEffect, useState } from 'react';
import api from '../services/api';

// load props if not initialized
export default function useFetchState (props) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(props);

  const fetch = async(url) => {
    setLoading(true)
    setState({})
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

  return [state, loading, fetch]
}
