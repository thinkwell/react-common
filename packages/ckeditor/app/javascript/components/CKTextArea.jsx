import React, { useState, useContext, useRef, useCallback } from 'react';
import {FormContext, useEffect} from '@thinkwell/react.common';
import 'requestidlecallback-polyfill';
import ckeditorConfig from './ckeditor/config';
import basePath from './ckeditor/basePath';

export default function CKTextArea(props) {
  if (!props.name) {
    throw `Property name is required for CKTextArea ${props.label}`
  }
  const form = useContext(FormContext)
  const nameHtml = Array.isArray(props.name) ? props.name.join('_') : props.name
  const id = props.id || nameHtml
  const divHolder = useRef();

  const isInvalid = (value) => {
    return !new RegExp("^" + props.pattern + "$").test(value);
  };

  const onChange = (value) => {
    form.onData(props.name)(value)
    CKEDITOR.instances[id] && CKEDITOR.instances[id].resetDirty();
    props.onChange && props.onChange(value, form)
  }

  CKEDITOR.plugins.addExternal( 'autogrow', `${basePath}/plugins/autogrow/`, 'plugin.js' );
  CKEDITOR.plugins.addExternal( 'base64image', `${basePath}/plugins/base64image/`, 'plugin.js' );
  CKEDITOR.plugins.addExternal( 'ckeditor_wiris', `${basePath}/plugins/ckeditor_wiris/`, 'plugin.js' );
  CKEDITOR.plugins.addExternal( 'editorplaceholder', `${basePath}/plugins/editorplaceholder/`, 'plugin.js' );

  useEffect(() => {
    window.requestIdleCallback(() => {
      CKEDITOR.replace(divHolder.current, Object.assign({}, ckeditorConfig, {editorplaceholder: props.placeholder}))
      const instance = CKEDITOR.instances[id]
      if (instance) {
        instance.resetDirty();
        instance.on('change', (evt) => {
          const data = evt.editor.getData()
          onChange(data)
        });
        instance.on('blur', (evt) => {
          const data = evt.editor.getData()
          onChange(data)
        });
      }
    })
  }, []);

  const validate = useCallback(() => {
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
  }, [form])

  useEffect(() => {
    form.register(props.name, validate)
  }, [])

  const value = form.field(props.name)
  return (
    <div>
      <div>
        <label id={`${id}Label`} htmlFor={id} className="Polaris-Label__Text">{props.label}</label>
      </div>
      <div>
        <textarea
          name={nameHtml}
          value={value || ''}
          onChange={(evt) => { onChange(evt.target.value) } }
          id={id}
          pattern={props.pattern}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          ref={el => divHolder.current = el}
        />
      </div>
    </div>
  )
}
