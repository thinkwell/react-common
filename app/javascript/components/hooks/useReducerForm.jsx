import React from 'react';
import useReducer from './useReducer'
import set from 'lodash/set'

export default function useReducerForm (props, data) {
  function reducer(state, action, attribute) {
    const payload = action.payload
    switch (action.type) {
      case attribute:
        if (action.field) {
          set(state, action.field, payload)
          return state;
        } else {
          set(state, attribute, payload)
          return state;
        }
    }
  }

  const [state, dispatch, onAction] = useReducer(props, data, reducer)

  return [state, onAction]
}
