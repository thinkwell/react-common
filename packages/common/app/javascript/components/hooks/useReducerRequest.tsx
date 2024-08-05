import React from 'react';
import useReducer from './useReducer.js'
import useApi from './useApi.js';

type RequestState = {
  requesting: boolean,
  error: string
}

export default function useReducerRequest (method:string, props):[RequestState, (url:string, data?, confirmMsg?:string) => Promise<any>] {
  function reducer(state, action) {
    const payload = action.payload
    switch (action.type) {
      case 'onSuccess':
        return {...state, requesting: false} as RequestStateProps;
      case 'onRequesting':
        return {...state, requesting: true} as RequestStateProps;
      case 'onError':
        const errorMessage = payload.response && payload.response.data && payload.response.data.message || payload.message;
        return {...state, requesting: false, error: errorMessage} as RequestStateProps;
    }
  }


  const initialArg = {}
  const [state, dispatch, onAction] = useReducer(props, initialArg, reducer)
  const api = useApi()
  
  const onSuccess = onAction('onSuccess')
  const onRequesting = onAction('onRequesting')
  const onError = onAction('onError')

  const onRequest = async (url, data?, confirmMsg?) => {
    if(confirmMsg && !confirm(confirmMsg)) {
      return
    }

    try {
      onRequesting()
      const methodArg = method as any
      const config = {method: methodArg, url: url} as any
      const response = await api(config)
      if(data) {
        config.data = data
      }
      onSuccess(response)
      return response
    } catch(error) {
      onError(error)
    }
  }

  return [state, onRequest]
}

export interface RequestStateProps {
  requesting: boolean,
  error: string
}
