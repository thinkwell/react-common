import React, { useReducer as useReducerReact, useRef } from 'react';
import lowerFirst from 'lodash/lowerFirst.js'

export default function useReducer (props, initialArg, reducer, init?):[any, React.Dispatch<any>, (type, field?) => (payload?: any) => void] {
  const stateRef = useRef({});

  function reducerCommon(state, action) {
    const attribute = lowerFirst(action.type.replace(/^on/, ''))
    const newState = reducer(state, action, attribute)
    console.log(`------------------- useReducer : ${attribute} : ${newState}`)
    stateRef.current = newState
    return newState
  }

  const onAction = (type, field?) => {
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
