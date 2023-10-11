import React, { useState, useEffect, useContext } from 'react';
import {Checkbox as CheckboxPolaris} from '@shopify/polaris';
import {FormContext} from '@thinkwell/react.common';
import { CheckboxProps } from '@shopify/polaris/build/ts/latest/src/components/Checkbox';

type Props = Omit<CheckboxProps, "name" | "onChange"> & {
  name: string | string[],
  onChange?: (value, FormProps?) => void
}

export default function Checkbox(props:Props) {
  if (!props.name) {
    throw `Property name is required for Checkbox ${props.label}`
  }
  const form = useContext(FormContext)
  const nameHtml = Array.isArray(props.name) ? props.name.join('_') : props.name
  const id = props.id || nameHtml

  const onChange = (value) => {
    form.onData(props.name)(value)
    props.onChange && props.onChange(value, form)
  }

  const value = form.field(props.name)
  const checked = value === 'true' || value === true

  return (<CheckboxPolaris
    label={props.label}
    checked={checked}
    onChange={onChange}
    value={props.value}
    onBlur={props.onBlur}
    onFocus={props.onFocus}
    name={nameHtml}
    id={id}
  />);
}
