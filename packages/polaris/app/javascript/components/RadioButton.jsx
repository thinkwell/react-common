import React, { useState, useEffect, useContext } from 'react';
import {RadioButton as RadioButtonPolaris} from '@shopify/polaris';
import {FormContext} from '@thinkwell/react.common';

export default function RadioButton(props) {
  if (!props.name) {
    throw `Property name is required for RadioButton ${props.label}`
  }
  const form = useContext(FormContext)
  const nameHtml = Array.isArray(props.name) ? props.name.join('_') : props.name
  const id = props.id || nameHtml

  const onChange = (value) => {
    form.onData(props.name)(value)
    props.onChange && props.onChange(value, form)
  }

  return (<RadioButtonPolaris
    label={props.label}
    onChange={onChange}
    value={props.value}
    name={nameHtml}
    id={id}
  />);
}
