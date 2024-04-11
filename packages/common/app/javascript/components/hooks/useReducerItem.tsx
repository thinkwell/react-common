import React from 'react';
import useReducer from './useReducer.js'

export default function useReducerItem (props, fieldsToEdit):[any, (field:string) => (payload: boolean) => void] {
  function reducer(state, action, attribute) {
    const payload = action.payload
    switch (action.type) {
      case 'onEdit':
        return {...state, [attribute]: {...state[attribute], [action.field]: payload}};
    }
  }

  const edit = fieldsToEdit.reduce((obj, field) => {
    obj[field] = false
    return obj
  }, {})
  const initialArg = {edit: edit}
  const [state, dispatch, onAction] = useReducer(props, initialArg, reducer)

  const onEdit = (field) => onAction('onEdit', field)

  return [state, onEdit]
}
