import React, { useState, useContext } from 'react';
import {TextField as TextFieldPolaris} from '@shopify/polaris';
import {FormContext} from './contexts/Form'
import basePath from './ckeditor/basePath';
import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import SpecialCharacters from '@ckeditor/ckeditor5-special-characters/src/specialcharacters';
import SpecialCharactersCurrency from '@ckeditor/ckeditor5-special-characters/src/specialcharacterscurrency';
import SpecialCharactersMathematical from '@ckeditor/ckeditor5-special-characters/src/specialcharactersmathematical';
import ReactHtmlParser from 'react-html-parser'
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
    InlineEditor.create( document.querySelector( `#${id}` ), {
      extraPlugins: [ Essentials, Paragraph, Bold, Italic, Strikethrough, RemoveFormat, Table, TableToolbar,
        SpecialCharacters, SpecialCharactersCurrency, SpecialCharactersMathematical, Base64UploadAdapter, MathType ],
      removePlugins: ['Resize', 'Elementspath'],
      toolbar: {
        items: ['bold', 'italic', 'strikethrough', 'removeFormat','|', 'insertTable',
        'specialCharacters','|', 'MathType', 'ChemType'],
        shouldNotGroupWhenFull: true
      },
      table: {
        contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
      },
      placeholder: props.placeholder
    } ).then( editor => {
      editor.setData(form.field(props.name))
      editor.model.document.on('change:data', (evt) => {
        const data = editor.getData()
        onChange(data)
      })
    })
    .catch( error => {
      console.error( error );
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
        <label id={`${id}Label`} htmlFor={id} className="Polaris-Label__Text">{props.label}</label>
      </div>
      <div>
        <div className={nameHtml}
          id={id}
        >
        </div>
      </div>
    </div>
  )
}
