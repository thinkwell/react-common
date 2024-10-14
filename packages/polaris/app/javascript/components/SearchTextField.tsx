import React, { useContext, useRef } from 'react';
import {SearchContext, useSearch} from '@thinkwell/react.common';
import {TextField, Icon, Button} from '@shopify/polaris';
import {SearchIcon, XCircleIcon} from '@shopify/polaris-icons';

export default function SearchTextField(props) {
  const [query] = useContext(SearchContext)
  
  const onSearch = props.onSearch || function(){}
  const [onSearchChange] = useSearch(onSearch)

  const onClear = () => {
    if (!!query) {
      onSearchChange("")
    }
  }

  return (
    <div>
      <TextField
        autoComplete='off'
        label=""
        labelHidden={true}
        onChange={onSearchChange}
        value={query}
        suffix={<Button onClick={onClear} icon={XCircleIcon} />}
        prefix={<Icon source={SearchIcon} tone="base" />}
        placeholder={props.placeholder}
      />
    </div>
  );
}
