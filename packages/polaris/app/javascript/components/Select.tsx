import React, { useContext, useEffect } from 'react';
import {Select as SelectPolaris, SelectProps, LegacyStack} from '@shopify/polaris';
import Spinner from './Spinner.js'
import {FormContext} from '@thinkwell/react.common';
import startCase from 'lodash/startCase.js';
import { FetchStateProps } from '@thinkwell/react.common/dist/hooks/useReducerFetch';

export type Props = Omit<SelectProps, "label" | "name" | "onChange"> & {
  name: string,
  required?: boolean,
  label: {singular: string, plural: string},
  onChange?: (value, form) => void,
  fetchState?: FetchStateProps,
  notFoundMessage?: string
}

export default function Select(props:Props) {
  if (!props.name) {
    throw `Property name is required for Select ${props.label.singular || props.label}`
  }

  const form = useContext(FormContext)

  const onChange = (value) => {
    form.onData(props.name)(value)
    props.onChange && props.onChange(value, form)
  }

  const validate = () => {
    if (props.required && !form.field(props.name)) {
      return {[props.name]: "Required " + (props.label.singular || props.label)}
    }
    return {}
  }

  useEffect(() => {
    form.register(props.name, validate)
  }, [])


  const selectEl = <SelectPolaris
    label={startCase(props.label.plural || props.label)}
    labelInline={typeof props.labelInline !== 'undefined' ? props.labelInline : true}
    options={props.options}
    onChange={onChange}
    value={form.field(props.name)}
    error={props.fetchState && props.fetchState.error}
  />

  return typeof props.labelInline !== 'undefined' && !props.labelInline ? selectEl : (
    <LegacyStack>
      { props.options && props.options.length || props.fetchState && props.fetchState.error ?
        <LegacyStack.Item fill>{selectEl}</LegacyStack.Item> :
        props.fetchState && !props.fetchState.loading ? <div>{props.notFoundMessage || `No ${props.label.plural || props.label} found`}</div> : null
      }
      { props.fetchState && props.fetchState.loading ? <Spinner active={props.fetchState.loading} /> : null }
    </LegacyStack>
  )
}
