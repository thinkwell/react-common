import React, { useEffect, useState } from 'react';
import api from '../services/api';

// load props if not initialized
export default function useFetchState (props) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState(props);

  const fetch = async(url) => {
    setLoading(true)
    const result = await api({method: 'get', url: url, headers: {'Content-Type': 'application/json',  'Accept': 'application/json'}, data: {}})
    setLoading(false)
    const data = result && result.data
    setState(data)
    return data
  }

  if (props) {
    useEffect(() => {
      fetch(props.url || window.location.href)
    }, [])
  }

  return [state, loading, fetch]
}
