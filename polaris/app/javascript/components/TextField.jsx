import React, { useState, useEffect, useContext } from 'react';
import {TextField as TextFieldPolaris} from '@shopify/polaris';
import {FormContext} from './contexts/Form'

export default function TextField(props) {
  if (!props.name) {
    throw `Property name is required for TextField ${props.label}`
  }
  const form = useContext(FormContext)
  const nameHtml = Array.isArray(props.name) ? props.name.join('_') : props.name
  const id = props.id || nameHtml

  const isInvalid = (value) => {
    return !new RegExp("^" + props.pattern + "$").test(value);
  };

  const onChange = (value) => {
    form.onData(props.name)(value)
    props.onChange && props.onChange(value, form)
  }

  const handleKeyPress = (event) => {
    const enterKeyPressed = event.keyCode === 13;
    if (enterKeyPressed) {
      props.onEnterPressed && props.onEnterPressed()
    }
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

  return (<div onKeyDown={handleKeyPress}>
    <TextFieldPolaris
    multiline={props.multiline}
    label={props.label}
    type={props.type || 'text'}
    value={form.field(props.name)}
    onChange={onChange}
    onBlur={props.onBlur}
    name={nameHtml}
    id={id}
    pattern={props.pattern}
    maxLength={props.maxLength}
    placeholder={props.placeholder}
  /></div>);
}
