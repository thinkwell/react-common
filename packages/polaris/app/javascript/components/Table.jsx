import React, { useState } from 'react';
import {Spinner as SpinnerPolaris} from '@shopify/polaris';

export default function Table(props) {

  return (<table><tbody>
    {
      props.rows.map((row) => {
        return { !!row.value ? <tr>
          <th style={{textAlign: "left", verticalAlign: "top", padding: "5px"}}>{row.label}</th>
          <td style={{textAlign: "left", verticalAlign: "top", padding: "5px"}}>{row.valueLabel || row.value}</td>
        </tr> : null }
      })
    }
  </tbody></table>)
}
