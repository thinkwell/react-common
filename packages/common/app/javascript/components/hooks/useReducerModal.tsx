import React from 'react';
import useReducer from './useReducer'

type ModalState = {
  active: boolean,
  saveClicked: boolean,
  saveError: string,
  saving: boolean
}

export default function useReducerModal (props, active):[ModalState, (active: boolean) => void, () => void, () => void, (saveError: string) => void, (saving: boolean) => void, () => void] {
  function reducer(state, action, attribute) {
    const payload = action.payload
    switch (action.type) {
      case 'onActive':
        // shopper-114 : clear save error when modal closes
        if (!payload) {
          return {...state, active: payload, saveClicked: false, saveError: null}
        } else {
          return {...state, active: payload};
        }
      case 'onClear':
        return {...state, saveClicked: false, saveError: null}
      case 'onSaveError':
        return {...state, saveError: payload}
      case 'onSaveClicked':
        return {...state, saveClicked: true}
      case 'onSaveSubmitted':
        return {...state, saveError: null, saving: true}
      case 'onSaving':
        return {...state, saving: payload}
    }
  }

  // trigger props listeners on init
  const init = (active) => {
    if (!!active) {
      props.onActive && props.onActive(active)
    }
    return {active: active}
  }
  const [state, dispatch, onAction] = useReducer(props, active, reducer, init)

  const onActive = onAction('onActive')
  const onSaveSubmitted = onAction('onSaveSubmitted')
  const onSaveClicked = onAction('onSaveClicked')
  const onSaveError = onAction('onSaveError')
  const onSaving = onAction('onSaving')
  const onClear = onAction('onClear')

  return [state, onActive, onSaveClicked, onSaveSubmitted, onSaveError, onSaving, onClear]
}
