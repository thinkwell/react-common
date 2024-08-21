import React, { useState, useEffect, useContext } from 'react';
import {TextField as TextFieldPolaris, TextFieldProps} from '@shopify/polaris';
import {FormContext} from '@thinkwell/react.common';

export type Props = Omit<TextFieldProps, "autoComplete" | "name" | "label"> & {
  name: string | string[],
  label?: string,
  autoComplete?: string,
  format?: (value) => string,
  onChange?: (value, form) => void,
  onEnterPressed?: () => void,
  required?: boolean
}

export default function TextField(props:Props) {
  if (!props.name) {
    throw `Property name is required for TextField ${props.label}`
  }
  const form = useContext(FormContext)
  const nameHtml = Array.isArray(props.name) ? props.name.join('_') : props.name
  const id = props.id || nameHtml

  const getValueAsString = () => {
    const value = form.field(props.name)
    return value && (props.format && props.format(value) || value.toString())
  }

  const valueAsString = getValueAsString()

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
    const valueAsString = getValueAsString()
    console.log(`----------------------- TextField#validate : ${props.name} : ${valueAsString}`)
    if (props.required && (!valueAsString || !valueAsString.length)) {
      errors.push("Required " + props.label)
    }

    if (valueAsString && valueAsString.length && props.pattern && isInvalid(valueAsString)) {
      errors.push("Invalid " + props.label)
    }

    return errors
  }

  useEffect(() => {
    form.register(props.name, validate)
  }, [])

  return (<div onKeyDown={handleKeyPress}>
    <TextFieldPolaris
    autoComplete={props.autoComplete || ""}
    multiline={props.multiline}
    label={props.label || ""}
    labelHidden={props.labelHidden}
    type={props.type || 'text'}
    value={valueAsString}
    onChange={onChange}
    onBlur={props.onBlur}
    onFocus={props.onFocus}
    name={nameHtml}
    id={id}
    disabled={props.disabled}
    pattern={props.pattern}
    maxLength={props.maxLength}
    placeholder={props.placeholder}
  /></div>);
}
