import React, { useState } from 'react';
import {Spinner as SpinnerPolaris} from '@shopify/polaris';

export default function Table(props) {

  return (<table><tbody>
    {
      props.rows.map((row, index) => {
        const value = row.valueLabel || row.value
        return !!row.value ? <tr key={`${row.label}_${index}`}>
          <th style={{textAlign: "left", verticalAlign: "top", padding: "5px"}}>{row.label}</th>
          <td style={{textAlign: "left", verticalAlign: "top", padding: "5px"}}>
            {row.image ? <img src={value} /> : value }
          </td>
        </tr> : null
      })
    }
  </tbody></table>)
}
