import React, { useContext, useRef } from 'react';
import {SearchContext, SortContext, useSearch} from '@thinkwell/react.common';
import {TextField, Icon, Button} from '@shopify/polaris';
import {SearchIcon, XCircleIcon} from '@shopify/polaris-icons';

export default function SearchTextField(props) {
  const [query] = useContext(SearchContext)
  const [sort] = useContext(SortContext)
  
  const onSearch = props.onSearch || function(){}
  const [onSearchChange] = useSearch(onSearch)

  const onClear = () => {
    if (!!query) {
      onSearchChange("")
    }
  }

  const onChange = (value) => {
    console.log(`SearchTextField#onChange : ${sort} : ${query} : ${value}`)
    onSearchChange(value)
  }

  return (
    <div>
      <TextField
        autoComplete='off'
        label=""
        labelHidden={true}
        onChange={onChange}
        value={query}
        suffix={<Button onClick={onClear} icon={XCircleIcon} variant="plain" />}
        prefix={<Icon source={SearchIcon} tone="base" />}
        placeholder={props.placeholder}
      />
    </div>
  );
}
