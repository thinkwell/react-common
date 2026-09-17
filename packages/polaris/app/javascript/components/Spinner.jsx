import React, { useState } from 'react';
import {Spinner as SpinnerPolaris} from '@shopify/polaris';

export default function Spinner(props) {
  const size = props.size || "small"

  return (
    <span className={`spinner spinner-${size} ${!props.children ? 'no-content' : ''}`} >
      <span className={`${props.active ? 'active' : ''}`}>
        {props.children}
      </span>
      { props.active ? <span className="image" title="spinner"><SpinnerPolaris color="teal" size={size} /></span> : null }
    </span>
  );
}
