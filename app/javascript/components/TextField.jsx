import React, { useState, useEffect, useContext } from 'react';
import {TextField as TextFieldPolaris} from '@shopify/polaris';
import {FormContext} from './contexts/Form'

export default function TextField(props) {
  if (!props.name) {
    throw `Property name is required for TextField ${props.label}`
  }
  const form = useContext(FormContext)

  const isInvalid = (value) => {
    return !new RegExp("^" + props.pattern + "$").test(value);
  };

  const onChange = (value) => {
    form.onData(props.name)(value)
    props.onChange && props.onChange(value, form)
  }

  const validate = () => {
    const errors = [];
    const value = form.field(props.name)
    const valueAsString = value && value.toString()
    if (props.required && (!valueAsString || !valueAsString.length)) {
      errors.push("Required " + props.label)
    }

    if (valueAsString && valueAsString.length && props.pattern && isInvalid(valueAsString)) {
      errors.push("Invalid " + props.label)
    }

    return errors
  }

  form.register(props.name, validate)

  return (<TextFieldPolaris
    multiline={props.multiline}
    label={props.label}
    type={props.type || 'text'}
    value={form.field(props.name)}
    onChange={onChange}
    onBlur={props.onBlur}
    name={props.name}
    id={props.id}
    pattern={props.pattern}
    maxLength={props.maxLength}
    placeholder={props.placeholder}
  />);
}