import React from 'react';
import useReducer from './useReducer'
import api from '../services/api';

export default function useReducerRequest (method, props) {
  function reducer(state, action) {
    const payload = action.payload
    switch (action.type) {
      case 'onSuccess':
        return {...state, requesting: false};
      case 'onRequesting':
        return {...state, requesting: true};
      case 'onError':
        const errorMessage = payload.response && payload.response.data && payload.response.data.message || payload.message;
        return {...state, requesting: false, error: errorMessage};
    }
  }


  const initialArg = {}
  const [state, dispatch, onAction] = useReducer(props, initialArg, reducer)

  const onSuccess = onAction('onSuccess')
  const onRequesting = onAction('onRequesting')
  const onError = onAction('onError')

  const onRequest = async (url, data, confirmMsg) => {
    if(confirmMsg && !confirm(confirmMsg)) {
      return
    }

    try {
      onRequesting()
      api.defaults.headers.common['X-CSRF-Token'] = document.querySelector("meta[name=csrf-token]").content
      const config = {method: method, url: url}
      if(data) {
        config.data = data
      }
      const response = await api(config)
      onSuccess(response)
      return response
    } catch(error) {
      onError(error)
    }
  }

  return [state, onRequest]
}
