import React from 'react'
import {doRender, getByText, getAllByText, queryByText, queryByClass, fireClick, getByLabelText, select, type, getByTitle, queryByTitle} from './TestHelper'
import AppProvider from 'AppProvider';
import {FormProvider} from 'contexts/Form';
import Form from 'Form';
import Select from 'Select'

let required, label, name, onChange, options, changed;

const render = () => {
  doRender(<div><meta name="csrf-token" content="somecsrftoken"/><AppProvider><FormProvider><Form submitText="Submit">
    <Select
      required={required}
      label={label}
      name={name}
      onChange={onChange}
      options={options}
    /></Form></FormProvider></AppProvider></div>)
}

describe('components/Select', () => {
  beforeEach(() => {
    required = undefined
    label = {singular: 'Some Label', plural: 'Some Labels'}
    name = 'someName'
    onChange = (_changed) => { changed = _changed}
    options = [{label: 'select a value', value: null}, {label: 'label1', value: 'value1'}]
  })

  describe('with required', () => {
    beforeEach(() => {
      required = true
      render()
    });

    describe('and select and submit', () => {
      beforeEach(() => {
        select(getByLabelText(label.plural), 'value1')
        fireClick(getByText('Submit'))
      })

      it('should NOT render error', () => {
        expect(queryByText(`Required ${label.singular}`)).toBeNull()
      });
    })

    describe('and submit', () => {
      beforeEach(() => {
        fireClick(getByText('Submit'))
      })

      it('should render error', () => {
        expect(getByText(`Required ${label.singular}`)).toBeInTheDocument()
      });
    })
  })

  describe('without name', () => {
    beforeEach(() => {
      name = undefined
    });

    it('should throw error', () => {
      expect(() => {render()}).toThrow(`Property name is required for Select ${label.singular}`);
    });
  })
});
