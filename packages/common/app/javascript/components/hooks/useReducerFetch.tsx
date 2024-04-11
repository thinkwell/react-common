import React from 'react';
import useReducer from './useReducer.js'

export default function useReducerFetch (props, value):[FetchStateProps, (payload?: any) => void, (payload?: any) => void, (payload?: any) => void] {
  function reducer(state, action, attribute) {
    const payload = action.payload
    switch (action.type) {
      case 'onFetch':
        return {...state, loading: true, error: null} as FetchStateProps;
      case 'onSuccess':
        return {...state, loading: false, items: payload} as FetchStateProps;
      case 'onError':
        const errorMessage = payload.response && payload.response.data && payload.response.data.message || payload.message;
        return {...state, loading:false, error: errorMessage} as FetchStateProps;
    }
  }

  const initialArg = {}
  const [state, dispatch, onAction] = useReducer(props, initialArg, reducer)

  const onFetch = onAction('onFetch')
  const onSuccess = onAction('onSuccess')
  const onError = onAction('onError')

  return [state, onFetch, onSuccess, onError]
}

export interface FetchStateProps {
  loading: boolean,
  error: string
}
