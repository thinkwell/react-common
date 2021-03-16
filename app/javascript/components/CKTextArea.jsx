import React, { useState, useEffect, useContext } from 'react';
import {TextField as TextFieldPolaris} from '@shopify/polaris';
import {FormContext} from './contexts/Form'

export default function CKTextArea(props) {
  if (!props.name) {
    throw `Property name is required for CKTextArea ${props.label}`
  }
  const form = useContext(FormContext)
  const id = props.id || props.name

  const isInvalid = (value) => {
    return !new RegExp("^" + props.pattern + "$").test(value);
  };

  const onChange = (value) => {
    form.onData(props.name)(value)
    props.onChange && props.onChange(value, form)
  }

  useEffect(() => {
    CKEDITOR.replace(id)
    CKEDITOR.instances[id].on('change', (evt) => {
      const data = evt.editor.getData()
      onChange(data)
    });
    CKEDITOR.instances[id].on('blur', (evt) => {
      const data = evt.editor.getData()
      onChange(data)
    });
  }, []);

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

  return (
    <div>
      <div>
        <label id={`${props.name}Label`} htmlFor={props.name} className="Polaris-Label__Text">{props.label}</label>
      </div>
      <div>
        <textarea
          value={form.field(props.name)}
          name={props.name}
          onChange={onChange}
          id={id}
          pattern={props.pattern}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
        />
      </div>
    </div>
  )
}
