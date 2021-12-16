import React from 'react'
import {doRender, getByText, getAllByText, queryByText, queryByClass, fireClick, getByLabelText, select, type, getByTitle, queryByTitle} from './TestHelper'
import mockAxios from 'jest-mock-axios';
import AppProvider from 'AppProvider';
import {FormProvider} from '@thinkwell/react.common';
import Form from 'Form';
import Checkbox from 'Checkbox';

afterEach(() => {
  mockAxios.reset();
});

let value, label, onBlur, name, id, blurred, onChange, changed, url, method;

const render = () => {
  doRender(<div><meta name="csrf-token" content="somecsrftoken"/><AppProvider><FormProvider><Form url={url} method={method} submitText="Submit">
    <Checkbox
      value={value}
      label={label}
      name={name}
      id={id}
      onBlur={onBlur}
      onChange={onChange}
    /></Form></FormProvider></AppProvider></div>)
}

describe('components/Checkbox', () => {
  beforeEach(() => {
    value = undefined
    label = 'someLabel'
    name = 'someName'
    id = undefined
    changed = undefined
    blurred = undefined
    onBlur = (_blurred) => { blurred = _blurred}
    onChange = (_changed) => { changed = _changed}
    url = 'https://url.example.org/somepath/someaction'
    method = 'post'
  })

  describe('with name', () => {
    beforeEach(() => {
      render()
    });

    it('should render label', () => {
      expect(getByText('someLabel')).toBeInTheDocument()
    });

    describe('and check', () => {
      beforeEach(() => {
        document.querySelector('.Polaris-Checkbox').click()
      })

      it('should select the checkbox', () => {
        expect(getByLabelText('someLabel')).toBeChecked()
      });

      describe('and submit', () => {
        beforeEach(() => {
          fireClick(getByText('Submit'))
        })

        it('should submit form', () => {
          const data = {}
          data[name] = true
          expect(mockAxios).toHaveBeenCalledWith({method: method, url: url,
          data: {item: data}});
        })
      })
    })
  })

  describe('without name', () => {
    beforeEach(() => {
      name = undefined
    });

    it('should throw error', () => {
      expect(() => {render()}).toThrow("Property name is required for Checkbox someLabel");
    });
  })
});
