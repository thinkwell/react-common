import React, { useState, useRef, useContext } from 'react';
import {FormLayout, InlineError, Link, Button} from '@shopify/polaris';
import Spinner from './Spinner'
import {Util, FormContext, useEffect, api} from '@thinkwell/react.common';
import map from 'lodash/map';

export default function Form(props) {
  const form = useContext(FormContext)
  const formRef = useRef();
  const [fileDownloadToken, setFileDownloadToken] = useState(Math.random().toString(36).substring(7))
  const [submitting, setSubmitting] = useState()
  const [submitClicked, setSubmitClicked] = useState(false)
  const [submitError, setSubmitError] = useState(props.submitError)

  useEffect(() => setSubmitting(props.submitting), [props.submitting]);
  useEffect(() => setSubmitError(props.submitError), [props.submitError]);

  const onSuccess = (res) => {
    if(res.data && res.data.status && res.data.status == 'error') {
      onError(res.data)
      return
    }

    // redirect if res.data.redirect_url or res.data.location is set
    if (res.data && (res.data.redirect_url || res.data.location)) {
      return Util.redirect(res.data)
    } else {
      onSubmitting(false)
      props.onSuccess && props.onSuccess(res.data)
    }
  }

  const onSubmitting = (value) => {
    // if submitting is handled from parent delegate else set state
    if (props.onSubmitting) {
      props.onSubmitting(value)
    } else {
      setSubmitting(value)
    }
  }

  const formatErrors = (errors) => {
    return map(errors, (value, key) => key + ' ' + value)
  }

  const onError = (error) => {
    error.stack && console.error(error.stack)
    const data = error.response && error.response.data
    const errorMessage = data && data.errors && formatErrors(data.errors) || data && data.message || error.message || error;

    onSubmitting(false)
    // if error is handled from parent delegate else set state
    if (props.onError) {
      props.onError(errorMessage)
    } else {
      setSubmitError(errorMessage)
    }
  }

  const handleSubmitHtml = async (e) => {
    e.preventDefault();

    const formData = new FormData(formRef.current);

    try {
      const csrfToken = document.querySelector("meta[name=csrf-token]").content

      const authToken = await props.getAuthToken()
      const method = props.method ? (typeof props.method == 'function' ? props.method() : props.method) : 'put';
      const url = typeof props.url == 'function' ? props.url(form) : props.url;

      const headers = {
        'X-CSRF-Token': csrfToken,  // ← Add CSRF header
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess({data: result})
      } else {
        console.log(result)
        onError(result);
      }
    } catch (error) {
      console.log(error)
      onError(error);
    } finally {
      onSubmitting(false)
    }
  };

  const submit = (extraData) => {
    onSubmitting(true)
    if (!props.useHtml) {
      api.defaults.headers.common['X-CSRF-Token'] = document.querySelector("meta[name=csrf-token]").content
      const formData = Object.assign({}, form.data, extraData || {})
      const method = props.method ? (typeof props.method == 'function' ? props.method() : props.method) : 'put';
      const url = typeof props.url == 'function' ? props.url(form) : props.url;
      const data = {};
      data[form.rootName || "item"] = formData
      const config = {method: method, url: url, data: data}
      if(props.headers) {
        config.headers = props.headers
      }
      return api(config)
      .then(onSuccess)
      .catch(onError)
    } else {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }

  if (props.submitRef) {
    props.submitRef.current = submit
  }

  const onClick = (event) => {
    event.preventDefault();
    setSubmitClicked(true);
    if(!form.errors.length) {
      submit();
    }
  }

  const formLayout =
    (<FormLayout>
      {props.children}
      { (props.submitText || props.submitButton) ?
        <Spinner active={submitting}>
          { props.submitText ?
            <input className="button" type="submit" value={props.submitText} disabled={!!submitting} onClick={onClick}/>
           : null }
          { props.submitButton ?
           <Button submit={true} disabled={!!submitting} onClick={onClick}>{props.submitButton}</Button>
          : null }
        </Spinner>
       : null}
    </FormLayout>)

  return (
    <div style={props.style}>
      { submitError ?
        <InlineError message={submitError} fieldID="submitErrorFieldID" />
      : null }
      { submitClicked && form.errors.length ?
        <InlineError message={(<div> {form.errors.map((error, index) => (<div key={index}>{error}</div>)) } </div>)} fieldID="validationErrorFieldID" />
      : null }
      { !props.useHtml ?
        formLayout :
        <form method="post" action={props.url} acceptCharset="UTF-8" ref={formRef} className="form" onSubmit={handleSubmitHtml}>
          {formLayout}
          <input type="hidden" name="fileDownloadToken" value={fileDownloadToken} />
        </form>
      }
    </div>
  );
}
