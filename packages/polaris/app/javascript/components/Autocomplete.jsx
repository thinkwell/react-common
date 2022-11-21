import React, { useState, useEffect, useContext } from 'react';
import {Autocomplete as AutocompletePolaris, Icon} from '@shopify/polaris';
import {SearchMinor, DeleteMajor} from '@shopify/polaris-icons';
import {FormContext} from '@thinkwell/react.common';
import axios from 'axios'

export default function Autocomplete(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState(props.value);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!props.name) {
    throw `Property name is required for Autocomplete ${props.label}`
  }
  const form = useContext(FormContext)
  const nameHtml = Array.isArray(props.name) ? props.name.join('_') : props.name
  const id = props.id || nameHtml
  const value = form.field(props.name)

  const onChange = (value) => {
    form.onData(props.name)(value)
    props.onChange && props.onChange(value, form)
  }

  const handleKeyPress = (event) => {
    const enterKeyPressed = event.keyCode === 13;
    if (enterKeyPressed) {
      props.onEnterPressed && props.onEnterPressed()
    }
  }

  const validate = () => {
    const errors = [];
    const value = form.field(props.name)
    const valueAsString = value && value.toString()
    if (props.required && (!valueAsString || !valueAsString.length)) {
      errors.push("Required " + props.label)
    }

    return errors
  }

  form.register(props.name, validate)

  const updateText = async(value) => {
    setInputValue(value);

    if (value.length < 2) {
      return
    }

    setLoading(true);
    const url = new URL(props.url)
    url.searchParams.add('q', encodeURIComponent(value))
    const response = await axios({method: 'get', url: url.toString()})
    // Format data into JSON
    const data = response.data;
    const resultOptions = data.items.map((result) => {
      return {
        value: result,
        label: result[props.valueProp]
      }
    })
    setOptions(resultOptions);
    setLoading(false);
  }

  const updateSelection = (selectedItems) => {
    const idProp = props.idProp || 'id'
    const selected = selectedItems.map((selectedItem) => {
      return options.find((option) => option.value[idProp] == selectedItem[idProp])
    }).pop()
    form.onData(props.name)(selected && selected.value[idProp])
    setInputValue(selected.value[props.valueProp]);
    setSelectedOptions([selected]);
  }

  const textField = (
    <AutocompletePolaris.TextField
      onChange={updateText}
      value={inputValue}
      label={props.label}
      prefix={<Icon source={SearchMinor} color="base" />}
      placeholder={props.placeholder || `Search ${props.label}`}
    />
  );

  return (<div onKeyDown={handleKeyPress}>
    <AutocompletePolaris
    allowMultiple={false}
    options={options}
    selected={selectedOptions}
    onSelect={updateSelection}
    loading={loading}
    textField={textField}
  /></div>);
}
