import React from 'react'
import Form from 'models/Form';
import AppProvider from 'AppProvider';
import {shop_name, customer} from '../TestHelper'
import {doRender} from '../TestHelper'

let form;

describe('models/Form', () => {
  describe('with parent and without name', () => {
    it('should throw error', () => {
      expect(() => {doRender(<AppProvider><Form parent="parent"></Form></AppProvider>)}).toThrow("if parent specified, name of child form must be specified too");
    });
  })
});
