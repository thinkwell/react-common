import React, { useContext, useState } from 'react';
import useReducerForm from '../hooks/useReducerForm'
import Util from '../Util'
import values from 'lodash/values'
import omit from 'lodash/omit'
import get from 'lodash/get'
import mergeWith from 'lodash/mergeWith'
import unset from 'lodash/unset'

export default function Form (props) {
  const scope = props.scope || 'data'
  const [initialData] = useState(props.data && props.data[scope] || props.data || {})
  const [formState, onAction] = useReducerForm({}, initialData)
  const validations = {}
  const children = {}

  const register = (name, validator) => {
    validations[scope] = validations[scope] || {}
    validations[scope][name] = validator
  }

  const validate = () => {
    const validators = validations[scope]
    if (!validators) {
      return []
    }

    const errors = Object.keys(validators).map((name) => {
      return {[name]: validators[name]()}
    })
    return errors
  }

  const isInt = (value) => {
    return !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10));
  }

  const obj = {
    field: (name) => {
      const data = mergeWith({},
        props.data && props.data[scope] || props.data,
        formState.data,
        formState[scope],
        (objValue, srcValue, key) => {
          // merge with default for arrays
          if (isInt(key)) {
            return;
          }

          // don't merge arrays but assign src array
          if (Array.isArray(objValue) && Array.isArray(srcValue)) {
            return srcValue
          }

          if (typeof objValue != 'undefined' && typeof srcValue == 'undefined') {
            return null
          }
      })
      if (Array.isArray(name)) {
        return get(data, name)
      } else {
        return data[name]
      }
    },
    get data() {
      const childrenData = values(children).map((form) => form.data)
      const data = mergeWith({},
        props.data && props.data[scope] || props.data,
        formState.data,
        formState[scope],
        ...childrenData,
        (objValue, srcValue, key) => {
          // merge with default for arrays
          if (isInt(key)) {
            return;
          }

          // don't merge arrays but assign src array
          if (Array.isArray(objValue) && Array.isArray(srcValue)) {
            return srcValue
          }

          if (typeof objValue != 'undefined' && typeof srcValue == 'undefined') {
            return null
          }
      })
      const value = omit(data, props.omit || [])
      return props.format && props.format(value) || value
    },
    get errors() {
      const errorsObj = validate()
      const childrenErrors = values(children).map((form) => form.errors)
      return Util.flattenDeep(Object.assign({}, errorsObj, ...childrenErrors));
    },
    onData: (name) => {
      return onAction(scope, name)
    },
    register: register,
    setChild: (name, form) => {
      children[name] = form
    },
    rootName: props.rootName
  }

  if (props.parent) {
    if (!props.name) {
      throw `if parent specified, name of child form must be specified too`
    }
    props.parent.setChild(props.name, obj)
  }

  return obj
}
