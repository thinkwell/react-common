import React from 'react'
import Form from 'models/Form';
import {shop_name, customer, doRender} from '../TestHelper'

let form;

describe('models/Form', () => {
  describe('with parent and without name', () => {
    it('should throw error', () => {
      expect(() => {doRender(<Form parent="parent"></Form>)}).toThrow("if parent specified, name of child form must be specified too");
    });
  })
});
