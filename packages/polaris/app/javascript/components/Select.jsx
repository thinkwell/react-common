import React, { useContext } from 'react';
import {Select as SelectPolaris, Stack} from '@shopify/polaris';
import Spinner from './Spinner'
import {FormContext} from '@thinkwell/react.common';
import startCase from 'lodash/startCase';

export default function Select(props) {
  if (!props.name) {
    throw `Property name is required for Select ${props.label.singular}`
  }

  const form = useContext(FormContext)

  const onChange = (value) => {
    form.onData(props.name)(value)
    props.onChange && props.onChange(value, form)
  }

  const validate = () => {
    if (props.required && !form.field(props.name)) {
      return {[props.name]: "Required " + props.label.singular}
    }
    return {}
  }

  form.register(props.name, validate)

  const selectEl = <SelectPolaris
    label={startCase(props.label.plural)}
    labelInline={typeof props.labelInline !== 'undefined' ? props.labelInline : true}
    options={props.options}
    onChange={onChange}
    value={form.field(props.name)}
    error={props.fetchState && props.fetchState.error}
  />

  return typeof props.labelInline !== 'undefined' && !props.labelInline ? selectEl : (
    <Stack>
      { props.options && props.options.length || props.fetchState && props.fetchState.error ?
        <Stack.Item fill>{selectEl}</Stack.Item> :
        props.fetchState && !props.fetchState.loading ? <div>{props.notFoundMessage || `No ${props.label.plural} found`}</div> : null
      }
      { props.fetchState && props.fetchState.loading ? <Spinner active={props.fetchState.loading} /> : null }
    </Stack>
  )
}
