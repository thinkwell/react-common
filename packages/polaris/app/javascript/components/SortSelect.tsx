import React, { useContext, useRef } from 'react';
import {useSearch, SortContext} from '@thinkwell/react.common';
import {Select, SelectOption, SelectGroup} from '@shopify/polaris';

type Props = {
  field?: string,
  onSearch: ((params) => void),
  options?: (SelectOption | SelectGroup)[]
}

export default function SortSelect(props:Props) {
  const [sort] = useContext(SortContext)
  const field = props.field || 'updated_at'
  const onSearch = props.onSearch || function(){}
  
  const [onSearchChange, onSortChange] = useSearch(onSearch)

  const options = props.options || [{
    label: 'Newest update',
    value: `${field} desc`
  }, {
    label: 'Oldest update',
    value: `${field} asc`
  }]

  return (
    <Select
      label="Sort by"
      labelInline
      options={options}
      onChange={onSortChange}
      value={sort} 
    />
  );
}
