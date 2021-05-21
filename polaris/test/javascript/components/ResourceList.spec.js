import React from 'react'
import {doRender, getByText, getAllByText, queryByText, queryByClass, fireClick, getByLabelText, select, type} from './TestHelper'
import mockAxios from 'jest-mock-axios';
import AppProvider from 'AppProvider';
import {PagingProvider} from 'contexts/Paging';
import {SearchProvider} from 'contexts/Search';
import ResourceList from 'ResourceList';

afterEach(() => {
  mockAxios.reset();
});

let onActive, active, items, previous_page_info, next_page_info, search, fetchItems, fetchItemsState, url, params, page_info;
const product1 = {id: '1', title: 'p1', sku: 'sku1'}
const product2 = {id: '2', title: 'p2', sku: 'sku2'}

const render = () => {
  doRender(<div><meta name="csrf-token" content="somecsrftoken"/><AppProvider>
  <PagingProvider page_info={page_info} previous_page_info={previous_page_info} next_page_info={next_page_info}>
  <SearchProvider search={search}>
    <ResourceList items={items} fetchItems={fetchItems} fetchItemsState={fetchItemsState}
    url="/admin/products.json" renderItem={(item) => (<div>{item.title}</div>)}/>
  </SearchProvider></PagingProvider></AppProvider></div>)
}

describe('components/ResourceList', () => {
  beforeEach(() => {
    url = undefined
    params = undefined
    fetchItems = (_url, _params) => { url = _url; params = _params}
    fetchItemsState = {}
    onActive = () => {}
    active = true
    previous_page_info = undefined
    next_page_info = 'someNextPageInfo'
    search = undefined
    page_info = undefined
  })

  describe('with fetchItemsState.error', () => {
    beforeEach(() => {
      fetchItemsState = {error: 'someFetchItemsError'}
      items = []
      render()
    })

    it('should render error', () => {
      expect(getByText('someFetchItemsError')).toBeInTheDocument()
    })
  })

  describe('with search', () => {
    beforeEach(() => {
      search = 'someSearch'
      items = [product1, product2]
      render()
    })

    describe('and change sort order', () => {
      beforeEach(() => {
        select(getByLabelText('Sort by'), 'updated_at asc')
      })

      it('should select sort order', () => {
        expect(getByLabelText('Sort by')).toHaveValue('updated_at asc')
      });

      it('should trigger fetchItems with query parameter', () => {
        expect(url).toBe("/admin/products.json");
        expect(params).toStrictEqual({"limit":10,"order":"updated_at asc","query":"someSearch"});
      })
    })
  })

  describe('with previous_page_info', () => {
    beforeEach(() => {
      items = [product1, product2]
      previous_page_info = 'somePreviousPageToken'
      render()
    })

    describe('and click previous button', () => {
      beforeEach(() => {
        fireClick(getByLabelText('Previous'))
      })

      it('should trigger fetchItems', () => {
        expect(url).toBe("/admin/products.json");
        expect(params).toStrictEqual({"page_info":"somePreviousPageToken","limit":10,"order":"updated_at desc"});
      })
    })
  })

  describe('with next_page_info', () => {
    beforeEach(() => {
      items = [product1, product2]
      next_page_info = 'someNextPageInfo'
      render()
    })

    describe('and click next button', () => {
      beforeEach(() => {
        fireClick(getByLabelText('Next'))
      })

      it('should trigger fetchItems', () => {
        expect(url).toBe("/admin/products.json");
        expect(params).toStrictEqual({"page_info":"someNextPageInfo","limit":10,"order":"updated_at desc"});
      })
    })
  })

  describe('with items', () => {
    beforeEach(() => {
      items = [product1, product2]
      render()
    })

    it('should render product1', () => {
      expect(getByText(product1.title)).toBeInTheDocument()
    })
    it('should render product2', () => {
      expect(getByText(product2.title)).toBeInTheDocument()
    })

    describe('and change sort order', () => {
      beforeEach(() => {
        select(getByLabelText('Sort by'), 'updated_at asc')
      })

      it('should select sort order', () => {
        expect(getByLabelText('Sort by')).toHaveValue('updated_at asc')
      });

      it('should trigger fetchItems', () => {
        expect(url).toBe("/admin/products.json");
        expect(params).toStrictEqual({"limit":10,"order":"updated_at asc"});
      })
    })
  })
});
