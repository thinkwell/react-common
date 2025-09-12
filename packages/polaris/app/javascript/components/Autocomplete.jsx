import React, { useState, useEffect, useContext, useCallback } from 'react';
import {Autocomplete as AutocompletePolaris, Icon} from '@shopify/polaris';
import {SearchMinor, DeleteMajor} from '@shopify/polaris-icons';
import {FormContext, useSearch} from '@thinkwell/react.common';
import axios from 'axios'

export default function Autocomplete(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState(props.value);
  const [options, setOptions] = useState([{
    value: null,
    label: 'No Results Found'
  }]);
  const [loading, setLoading] = useState(props.loading || false);
  const [onSearchChange] = useSearch((params) => fetchValues(params.query))

  if (!props.name) {
    throw `Property name is required for Autocomplete ${props.label}`
  }

  useEffect(() => { setInputValue(props.value); }, [props.value])
  useEffect(() => { setLoading(props.loading); }, [props.loading])

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

  const formatLabel = props.formatLabel || ((value) => {
    return value[props.valueProp]
  })

  const updateText = useCallback((value) => {
    setInputValue(value);

    if (value.length < 2) {
      return
    }

    onSearchChange(value)
  }, [])

  const fetchValues = async(value) => {
    setLoading(true);
    const url = new URL(props.url)
    url.searchParams.set('query', value)
    if (props.limit) {
      url.searchParams.set('limit', props.limit)
    }
    const response = await axios({method: 'get', url: url.toString()})
    // Format data into JSON
    const data = response.data;
    const resultOptions = (data.items || data).map((result) => {
      return {
        value: result,
        label: formatLabel(result)
      }
    })
    setOptions(resultOptions);
    setLoading(false);
  }

  const updateSelection = useCallback((selectedItems) => {
    const idProp = props.idProp || 'id'
    const selected = selectedItems.map((selectedItem) => {
      return options.find((option) => option.value[idProp] == selectedItem[idProp])
    }).pop()
    form.onData(props.name)(selected && selected.value[idProp])
    setInputValue(formatLabel(selected.value));
    setSelectedOptions([selected]);
  }, [options])

  const onClearButtonClick = () => {
    setInputValue('')
    setOptions([])
    setSelectedOptions([])
    form.onData(props.name)(null)
  }

  const textField = (
    <AutocompletePolaris.TextField
      onChange={updateText}
      value={inputValue}
      label={props.label}
      clearButton
      onClearButtonClick={onClearButtonClick}
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
