import React from 'react';
import useReducer from './useReducer'
import set from 'lodash/set'

export default function useReducerForm (props, data):[any, (scope:string, name?:string) => (payload?: any) => void] {
  function reducer(state, action, attribute) {
    const payload = action.payload
    switch (action.type) {
      case attribute:
        if (action.field) {
          if (Array.isArray(action.field)) {
            const attributeObj = set({...state[attribute]}, action.field, payload)
            return {...state, [attribute]: attributeObj};
          } else {
            return {...state, [attribute]: {...state[attribute], [action.field]: payload}};
          }
        } else {
          return {...state, [attribute]: payload};
        }
    }
  }

  const [state, dispatch, onAction] = useReducer(props, data, reducer)

  return [state, onAction]
}
