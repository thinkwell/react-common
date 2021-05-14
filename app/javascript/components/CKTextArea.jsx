import React, { useState, useContext } from 'react';
import {TextField as TextFieldPolaris} from '@shopify/polaris';
import {FormContext} from './contexts/Form'
import useEffect from './hooks/useEffect'
import ReactHtmlParser from 'react-html-parser'
import 'requestidlecallback-polyfill';
import basePath from './ckeditor/basePath';
import ckeditorConfig from './ckeditor/config';

export default function CKTextArea(props) {
  if (!props.name) {
    throw `Property name is required for CKTextArea ${props.label}`
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

  CKEDITOR.plugins.addExternal( 'autogrow', `${basePath}/plugins/autogrow/`, 'plugin.js' );
  CKEDITOR.plugins.addExternal( 'base64image', `${basePath}/plugins/base64image/`, 'plugin.js' );
  CKEDITOR.plugins.addExternal( 'ckeditor_wiris', `${basePath}/plugins/ckeditor_wiris/`, 'plugin.js' );
  CKEDITOR.plugins.addExternal( 'editorplaceholder', `${basePath}/plugins/editorplaceholder/`, 'plugin.js' );

  useEffect(() => {
    CKEDITOR.replace(id, Object.assign({}, ckeditorConfig, {editorplaceholder: props.placeholder}))
    const instance = CKEDITOR.instances[id]
    if (instance) {
      instance.on('change', (evt) => {
        const data = evt.editor.getData()
        onChange(data)
      });
      instance.on('blur', (evt) => {
        const data = evt.editor.getData()
        onChange(data)
      });
    }
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
  const value = form.field(props.name)
  return (
    <div>
      <div>
        <label id={`${id}Label`} htmlFor={id} className="Polaris-Label__Text">{props.label}</label>
      </div>
      <div>
        <textarea className={`ck-content ck ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred ${nameHtml}`}
          value={value}
          aria-label={props.label}
          id={id}
        />
      </div>
    </div>
  )
}
