import React, { useContext } from 'react';
import useReducerForm from '../hooks/useReducerForm'
import Util from '../Util'
import values from 'lodash/values'
import omit from 'lodash/omit'
import get from 'lodash/get'

export default function Form (props) {
  const [formState, onAction] = useReducerForm({}, {})
  const scope = props.scope || 'data'
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

  const obj = {
    field: (name) => {
      const data = Object.assign({}, props.data && props.data[scope] || props.data, formState.data, formState[scope])
      return get(data, name)
    },
    get data() {
      const childrenData = values(children).map((form) => form.data)
      const data = Object.assign({}, props.data && props.data[scope] || props.data, formState.data, formState[scope], ...childrenData)
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
