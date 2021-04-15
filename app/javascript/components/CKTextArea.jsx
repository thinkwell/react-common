import React, { useState, useContext } from 'react';
import {TextField as TextFieldPolaris} from '@shopify/polaris';
import {FormContext} from './contexts/Form'
import useEffect from './hooks/useEffect'

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

  useEffect(() => {
    if (window.InlineEditor) {
      InlineEditor.create( document.querySelector( `#${id}` ), {
  			toolbar: {
  				items: [
  					'bold',
  					'italic',
  					'strikethrough',
  					'|',
  					'removeFormat',
  					'|',
  					'imageUpload',
  					'insertTable',
  					'specialCharacters',
  					'|',
  					'MathType'
  				]
  			},
  			language: 'en',
  			image: {
  				toolbar: [
  					'imageTextAlternative',
  					'imageStyle:full',
  					'imageStyle:side'
  				]
  			},
  			table: {
  				contentToolbar: [
  					'tableColumn',
  					'tableRow',
  					'mergeTableCells'
  				]
  			},
  			placeholder: props.placeholder
  		}, {onChange: onChange, value: value}).then( editor => {
        editor.setData(form.field(props.name))
        editor.model.document.on('change:data', (evt) => {
          const data = editor.getData()
          onChange(data)
        })
      })
      .catch( error => {
        console.error( error );
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
  return (
    <div>
      <div>
        <label id={`${id}Label`} htmlFor={id} className="Polaris-Label__Text">{props.label}</label>
      </div>
      <div>
        { window.InlineEditor ?
          <div className={nameHtml}
            aria-label={props.label}
            id={id}
          /> :
          <TextFieldPolaris
            className={nameHtml}
            aria-label={props.label}
            id={id}
            value={form.field(props.name)}
            onChange={onChange}
          />
        }
      </div>
    </div>
  )
}
