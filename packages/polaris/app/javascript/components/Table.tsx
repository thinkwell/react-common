import React, { useState } from 'react';
import {Spinner as SpinnerPolaris} from '@shopify/polaris';

type Row = {
  valueLabel?: string,
  value?: string,
  label?: string,
  image?: boolean
}
type Props = {
  rows: Row[]
}

export default function Table(props:Props) {

  return (<table><tbody>
    {
      props.rows.map((row, index) => {
        const value = row.valueLabel || row.value
        return !!row.value ? <tr key={`${row.label}_${index}`}>
          <th style={{textAlign: "left", verticalAlign: "top", padding: "5px"}}>{row.label}</th>
          <td style={{textAlign: "left", verticalAlign: "top", padding: "5px", whiteSpace: "pre-wrap"}}>
            {row.image ? <img src={value} /> : value }
          </td>
        </tr> : null
      })
    }
  </tbody></table>)
}
