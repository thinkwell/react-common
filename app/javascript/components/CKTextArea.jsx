import React, { useState, useContext } from 'react';
import {TextField as TextFieldPolaris} from '@shopify/polaris';
import {FormContext} from './contexts/Form'
import ConvertAttributes from './ConvertAttributes'
import useEffect from './hooks/useEffect'
import ReactHtmlParser from 'react-html-parser'
import 'requestidlecallback-polyfill';

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

  if (window.InlineEditor) {
    useEffect(() => {
      window.requestIdleCallback(() => {
        InlineEditor.create( document.querySelector( `#${id}` ), {
          extraPlugins: [
            ConvertAttributes('em', {isBlock: true, allowWhere: '$block', allowContentOf: '$root'}),
            ConvertAttributes('b', {isBlock: true, allowWhere: '$block', allowContentOf: '$root'}),
            ConvertAttributes('span', {isInline: true, allowWhere: '$block', allowContentOf: '$root'})
          ],
          toolbar: {
            items: [
              'htmlEmbed',
              '|',
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
          alignment: {
            options: [ 'left', 'right', 'center', 'justify' ]
          },
          language: 'en',
          image: {
            toolbar: [
              'imageTextAlternative',
              'imageStyle:full',
              'imageStyle:side'
            ]
          },
          mathTypeParameters : {
            serviceProviderProperties : {
              URI : '/wirispluginengine/integration',
              server : 'ruby'
            }
          },
          table: {
            contentToolbar: [
              'tableColumn', 'tableRow', 'mergeTableCells',
              'tableProperties', 'tableCellProperties'
            ],
          },
          image: {
            // Configure the available styles.
            styles: [
                'alignLeft', 'alignCenter', 'alignRight'
            ],

            // Configure the available image resize options.
            resizeOptions: [
                {
                    name: 'resizeImage:original',
                    label: 'Original',
                    value: null
                },
                {
                    name: 'resizeImage:50',
                    label: '50%',
                    value: '50'
                },
                {
                    name: 'resizeImage:75',
                    label: '75%',
                    value: '75'
                }
            ],

            // You need to configure the image toolbar, too, so it shows the new style
            // buttons as well as the resize buttons.
            toolbar: [
                'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
                '|',
                'resizeImage',
                '|',
                'imageTextAlternative'
            ]
          },
          htmlEmbed: {
            showPreviews: true
          },
          placeholder: props.placeholder
        }, {onChange: onChange, value: value}).then( editor => {
          const value = form.field(props.name);
          if (value) {
            window.requestIdleCallback(() => {
              editor.setData(value)
            })
          }
          if (props.setDataRef) {
            props.setDataRef.current = (data) => {
              editor.setData(data)
            }
          }
          if (props.getDataRef) {
            props.getDataRef.current = () => {
              return editor.getData()
            }
          }
          editor.model.document.on('change:data', (evt) => {
            const data = editor.getData()
            onChange(data)
          })
        })
        .catch( error => {
          console.error( error );
        });
      });
    }, [])
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
  const value = form.field(props.name)
  return (
    <div>
      <div>
        <label id={`${id}Label`} htmlFor={id} className="Polaris-Label__Text">{props.label}</label>
      </div>
      <div>
        { window.InlineEditor ?
          <div className={`ck-content ck ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred ${nameHtml}`}
            aria-label={props.label}
            id={id}
          /> :
          <TextFieldPolaris
            className={nameHtml}
            aria-label={props.label}
            id={id}
            value={value}
            onChange={onChange}
          />
        }
      </div>
    </div>
  )
}
