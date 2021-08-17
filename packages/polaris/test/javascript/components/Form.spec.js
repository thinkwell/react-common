import React from 'react'
import {doRender, getByText, getAllByText, queryByText, queryByClass, fireClick, getByLabelText, select, type, getByTitle, queryByTitle} from './TestHelper'
import mockAxios from 'jest-mock-axios';
import AppProvider from 'AppProvider';
import {FormProvider} from '@thinkwell/react.common';
import Form from 'Form';

afterEach(() => {
  mockAxios.reset();
});


let onSuccess, onError, submitRef, method, url, data, onSubmitting, onSuccessData,
onErrorData, onSubmittingState, replaceUrl, submitText, useHtml, submitButton;

const render = () => {
  doRender(<div><meta name="csrf-token" content="somecsrftoken"/><AppProvider><FormProvider data={data}>
    <Form
      useHtml={useHtml}
      onSuccess={onSuccess}
      onError={onError}
      submitRef={submitRef}
      method={method}
      url={url}
      submitText={submitText}
      onSubmitting={onSubmitting}
      submitButton={submitButton}
    >
      <input type="hidden" name="someInput" value="someValue"/>
    </Form>
   </FormProvider></AppProvider></div>)
}

describe('components/Form', () => {
  beforeEach(() => {
    method = 'post'
    url = 'https://url.example.org/somepath/someaction'
    onSuccess = (data) => { onSuccessData = data }
    onError = (data) => { onErrorData = data }
    data = {test: 'someval', test2: 'someval2'}
    location.replace = (url) => { replaceUrl = url }
    submitRef = {}
    onSubmitting = undefined
    onSuccessData = undefined
    onErrorData = undefined
    onSubmittingState = undefined
    submitText = undefined
    replaceUrl = undefined
    useHtml = undefined
  })

  describe('without onError', () => {
    beforeEach(() => {
      onError = undefined
      render()
    });

    it('should set submit callback', () => {
      expect(submitRef.current).not.toBeNull()
    });

    describe('and submit', () => {
      beforeEach(() => {
        submitRef.current()
      })

      it('should submit form', () => {
        expect(mockAxios).toHaveBeenCalledWith({method: method, url: url,
        data: {item: data }});
      })

      describe('and error', () => {
        beforeEach(() => {
          mockAxios.mockError({message: 'someerror'});
        });

        it('should show submit error', () => {
          expect(getByText('someerror')).toBeInTheDocument()
        });
      });

      describe('and error with response.data.errors', () => {
        beforeEach(() => {
          mockAxios.mockError({response: {data: {errors: {end_at: ["is not after start_at"]}}}});
        });

        it('should show submit error', () => {
          expect(getByText('end_at is not after start_at')).toBeInTheDocument()
        });
      });
    });
  });

  describe('with onSubmitting', () => {
    beforeEach(() => {
      onSubmitting = (state) => { onSubmittingState = state }
      render()
    });

    it('should set submit callback', () => {
      expect(submitRef.current).not.toBeNull()
    });

    describe('and submit', () => {
      beforeEach(() => {
        submitRef.current()
      })

      it('should submit form', () => {
        expect(mockAxios).toHaveBeenCalledWith({method: method, url: url,
        data: {item: data }});
      })

      describe('and success', () => {
        const response = {data: 'someval', data1: 'someval1'}
        beforeEach(() => {
          mockAxios.mockResponse({data: response});
        });

        it('should call onSuccess()', () => {
          expect(onSuccessData).toBe(response)
        });
      });

      describe('and success with error status', () => {
        const response = {data: {status: 'error', stack: 'someerrorstack',
        response: {data: {message: 'someerrormessage'}}}}
        beforeEach(() => {
          mockAxios.mockResponse(response);
        });

        it('should call onError()', () => {
          expect(onErrorData).toBe('someerrormessage')
        });
      });

      describe('and success with data.redirect_url', () => {
        const response = {data: {redirect_url: 'someredirecturl'}}
        beforeEach(() => {
          mockAxios.mockResponse(response);
        });

        it('should call location.replace with redirect url', () => {
          expect(replaceUrl).toBe('someredirecturl')
        });
      });

      describe('and success with data.location', () => {
        const response = {data: {location: 'someredirecturl'}}
        beforeEach(() => {
          mockAxios.mockResponse(response);
        });

        it('should call location.replace with location url', () => {
          expect(replaceUrl).toBe('someredirecturl')
        });
      });
    })
  })

  describe('with url and method as functions', () => {
    beforeEach(() => {
      url = () => 'https://url.example.org/somepath2/someaction2'
      method = () => 'delete'
      data = {test3: 'someval3', test4: 'someval4'}
      submitButton = "someSubmitButton"
      render()
    });

    it('should set submit callback', () => {
      expect(submitRef.current).not.toBeNull()
    });

    it('should render submit button text', () => {
      expect(getByText('someSubmitButton')).toBeInTheDocument()
    });

    describe('and click submit', () => {
      beforeEach(() => {
        fireClick(getByText('someSubmitButton'))
      })

      it('should submit form', () => {
        expect(mockAxios).toHaveBeenCalledWith({method: method(), url: url(),
        data: {item: data }});
      })
    })
  })

  describe('with useHtml', () => {
    beforeEach(() => {
      useHtml = true;
      render()
    });

    it('should set submit callback', () => {
      expect(submitRef.current).not.toBeNull()
    });

    describe('and submit', () => {
      let clearIntervalCalled, fileDownloadToken;
      beforeEach(() => {
        clearIntervalCalled = false
        fileDownloadToken = document.querySelector('[name="fileDownloadToken"]').value
        window.clearInterval = (id) => {
          clearIntervalCalled = true
        }
        window.setInterval = (callback, delay) => {
          callback()
        }
      })

      describe('with cookie response', () => {
        beforeEach(() => {
          document.cookie = "fileDownloadToken=" + JSON.stringify({value: fileDownloadToken, result: {rows: 3}})
          submitRef.current()
        })

        it('should call clearInterval', () => {
          expect(clearIntervalCalled).toBe(true)
        })
        it('should hide spinner', () => {
          expect(queryByTitle('spinner')).toBeNull()
        })
        it('should change fileDownloadToken', () => {
          expect(document.querySelector('[name="fileDownloadToken"]').value).not.toBe(fileDownloadToken)
        })
        it('should call onSuccess()', () => {
          expect(onSuccessData).toStrictEqual({rows: 3})
        });
      })

      describe('with cookie response but no results', () => {
        beforeEach(() => {
          document.cookie = "fileDownloadToken=" + JSON.stringify({value: fileDownloadToken})
          submitRef.current()
        })

        it('should call clearInterval', () => {
          expect(clearIntervalCalled).toBe(true)
        })
        it('should hide spinner', () => {
          expect(queryByTitle('spinner')).toBeNull()
        })
        it('should change fileDownloadToken', () => {
          expect(document.querySelector('[name="fileDownloadToken"]').value).not.toBe(fileDownloadToken)
        })
        it('should call onSuccess()', () => {
          expect(onSuccessData).toStrictEqual({})
        });
      })

      describe('with cookie response but no fileDownloadToken', () => {
        beforeEach(() => {
          document.cookie = "someOtherToken=test"
          submitRef.current()
        })

        it('should not call clearInterval', () => {
          expect(clearIntervalCalled).toBe(false)
        })
        it('should show spinner', () => {
          expect(queryByTitle('spinner')).toBeInTheDocument()
        })
        it('should leave fileDownloadToken', () => {
          expect(document.querySelector('[name="fileDownloadToken"]').value).toBe(fileDownloadToken)
        })
      })

      describe('with wrong formatted cookie response', () => {
        beforeEach(() => {
          document.cookie = "fileDownloadToken=wrongJsonFormat++"
          submitRef.current()
        })

        it('should not call clearInterval', () => {
          expect(clearIntervalCalled).toBe(false)
        })
        it('should show spinner', () => {
          expect(queryByTitle('spinner')).not.toBeNull()
        })
        it('should leave fileDownloadToken', () => {
          expect(document.querySelector('[name="fileDownloadToken"]').value).toBe(fileDownloadToken)
        })
      })

      describe('without cookie', () => {
        beforeEach(() => {
          document.cookie = ""
          submitRef.current()
        })

        it('should call clearInterval', () => {
          expect(clearIntervalCalled).toBe(false)
        })
        it('should show spinner', () => {
          expect(getByTitle('spinner')).toBeInTheDocument()
        })
        it('should leave fileDownloadToken', () => {
          expect(document.querySelector('[name="fileDownloadToken"]').value).toBe(fileDownloadToken)
        })
      })
    })
  })
});
