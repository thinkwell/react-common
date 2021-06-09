import React from 'react'
import {doRender, getByText, getAllByText, queryByText, queryByClass, fireClick, getByLabelText, select, type, getByTitle, queryByTitle} from './TestHelper'
import AppProvider from 'AppProvider';
import {FormProvider} from '@thinkwell/react.common';
import Form from 'Form';
import TextField from 'TextField';

let value, pattern, required, label, multiline, onBlur, name, id, maxLength, placeholder, blurred, onChange, changed;

const render = () => {
  doRender(<div><meta name="csrf-token" content="somecsrftoken"/><AppProvider><FormProvider><Form submitText="Submit">
    <TextField
      value={value}
      pattern={pattern}
      required={required}
      label={label}
      multiline={multiline}
      name={name}
      id={id}
      maxLength={maxLength}
      placeholder={placeholder}
      onBlur={onBlur}
      onChange={onChange}
    /></Form></FormProvider></AppProvider></div>)
}

describe('components/TextField', () => {
  beforeEach(() => {
    value = undefined
    pattern = undefined
    required = undefined
    label = 'someLabel'
    multiline = undefined
    name = 'someName'
    id = undefined
    maxLength = undefined
    placeholder = undefined
    changed = undefined
    blurred = undefined
    onBlur = (_blurred) => { blurred = _blurred}
    onChange = (_changed) => { changed = _changed}
  })

  describe('without required', () => {
    beforeEach(() => {
      render()
    });

    it('should render label', () => {
      expect(getByText('someLabel')).toBeInTheDocument()
    });
  })

  describe('without name', () => {
    beforeEach(() => {
      name = undefined
    });

    it('should throw error', () => {
      expect(() => {render()}).toThrow("Property name is required for TextField someLabel");
    });
  })

  describe('without pattern', () => {
    beforeEach(() => {
      pattern = '\d*'
      render()
    });

    describe('and type and submit', () => {
      beforeEach(() => {
        type(getByLabelText(label), 'sometext')
        fireClick(getByText('Submit'))
      })

      it('should render error', () => {
        expect(getByText(`Invalid ${label}`)).toBeInTheDocument()
      });
    })
  })
});
