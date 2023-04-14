import React, { useReducer as useReducerReact, useRef } from 'react';
import lowerFirst from 'lodash/lowerFirst'

export default function useReducer (props, initialArg, reducer, init) {
  const stateRef = useRef({});

  function reducerCommon(state, action) {
    const attribute = lowerFirst(action.type.replace(/^on/, ''))
    const newState = reducer(state, action, attribute)
    stateRef.current = newState
    return newState
  }

  const onAction = (type, field) => {
    return (payload) => {
      const attribute = lowerFirst(type.replace(/^on/, ''))
      const action = {type, payload, field}
      dispatch(action)
      const newState = reducerCommon(stateRef.current, action)
      props[type] && props[type](newState[attribute] || payload)
    }
  }

  const [state, dispatch] = useReducerReact(reducerCommon, initialArg, init)
  return [state, dispatch, onAction]
}
