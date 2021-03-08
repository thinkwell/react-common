import React from 'react'
import { render, fireEvent, waitForElement, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

// https://github.com/testing-library/react-testing-library/issues/281
window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
});
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})
afterAll(() => {
  console.error = originalError
})

export const queryByClass = (className) => {
  return queryByText((content, element) => new RegExp("\\b" + className + "\\b").test(element.className))
}

export const queryById = (id) => {
  return queryByText((content, element) => element.id === id)
}

export const queryAllByClass = (className) => {
  return queryAllByText((content, element) => new RegExp("\\b" + className + "\\b").test(element.className))
}

export const doRender = (component) => {
  const result = render(component)
  getByText = result.getByText;
  getAllByText = result.getAllByText;
  queryByText = result.queryByText;
  queryAllByText = result.queryAllByText;
  getByTitle = result.getByTitle;
  queryByTitle = result.queryByTitle;
  getByLabelText = result.getByLabelText;
  getAllByLabelText = result.getAllByLabelText;
  queryByLabelText = result.queryByLabelText;
  getByPlaceholderText = result.getByPlaceholderText;
  container = result.container;
  return result;
}

export let getByText, getAllByText, queryByText, getByLabelText, queryByLabelText, getByPlaceholderText, queryAllByText, getByTitle, getAllByLabelText, queryByTitle;
export let container;
export let fireClick = fireEvent.click;
export let fireBlur = fireEvent.blur;
export let type = userEvent.type;
export let select = userEvent.selectOptions;
