import React from 'react'
import AppProvider from 'AppProvider';
import {FormProvider} from 'contexts/Form';
import EditModal from 'EditModal';
import {doRender, getByText, getAllByText, queryByText, queryByClass, fireClick, getByLabelText, select, type} from './TestHelper'
import mockAxios from 'jest-mock-axios';

afterEach(() => {
  mockAxios.reset();
});


let onSave, onActive, linkText, active, title, saveText, data, onSaveData, onActiveState;
const url = 'https://url.example.org/somepath/someaction'

const render = () => {
  doRender(<div><meta name="csrf-token" content="somecsrftoken"/><AppProvider><FormProvider data={data}>
    <EditModal
    title={title} active={active} onActive={onActive} linkText={linkText}
    saveText={saveText} url={url} onSave={onSave}/>
  </FormProvider></AppProvider></div>)
}

describe('components/EditModal', () => {
  beforeEach(() => {
    onSave = (data) => { onSaveData = data }
    onActive = undefined
    active = undefined
    linkText = undefined
    title = undefined
    saveText = undefined
    onSaveData = undefined
    onActiveState = undefined
    data = {test: 'someval', test2: 'someval2'}
  })

  describe('with onActive, linkText, saveText, title and active', () => {
    beforeEach(() => {
      onActive = (state) => { onActiveState = state }
      active = true
      linkText = 'somelinktext'
      saveText = 'somesavetext'
      title = 'sometitle'
      render()
    });

    it('should render linkText', () => {
      expect(getByText(linkText)).toBeInTheDocument()
    });

    it('should render title', () => {
      expect(getByText(title)).toBeInTheDocument()
    });

    it('should render saveText', () => {
      expect(getByText(saveText)).toBeInTheDocument()
    });

    describe('and submit', () => {
      beforeEach(() => {
        fireClick(getByText(saveText))
        expect(mockAxios).toHaveBeenCalledWith({method: 'put', url: url,
          data: {item: data }});
      })

      describe('and success', () => {
        const response = {data: 'someval', data1: 'someval1'}
        beforeEach(() => {
          mockAxios.mockResponse({data: response});
        });

        it('should call onSave()', () => {
          expect(onSaveData).toBe(response)
        });
      });

      describe('and failure', () => {
        const message = 'someerrormessage'
        beforeEach(() => {
          mockAxios.mockError({message: message});
        });

        it('should call onError()', () => {
          expect(getByText(message)).toBeInTheDocument()
        });
      });
    })

    describe('and close via icon', () => {
      beforeEach(() => {
        fireClick(document.querySelector('.Polaris-Modal-CloseButton'))
      })

      it('should set active to false', () => {
        expect(onActiveState).toBe(false)
      })
    });

    describe('and close via button', () => {
      beforeEach(() => {
        fireClick(getByText('Cancel'))
      })

      it('should set active to false', () => {
        expect(onActiveState).toBe(false)
      })
    });
  })
});
