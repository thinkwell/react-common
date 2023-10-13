import React, { useState } from 'react';
import {Spinner as SpinnerPolaris, SpinnerProps} from '@shopify/polaris';

type Props = {
  size?: SpinnerProps['size'],
  children?: any,
  active?: boolean
}

export default function Spinner(props:Props) {
  const size = props.size || "small"

  return (
    <span className={`spinner spinner-${size} ${!props.children ? 'no-content' : ''}`} >
      <span className={`${props.active ? 'active' : ''}`}>
        {props.children}
      </span>
      { props.active ? <span className="image" title="spinner"><SpinnerPolaris size={size} /></span> : null }
    </span>
  );
}
