import React, { useState, useRef, useContext, MutableRefObject, CSSProperties } from 'react';
import {FormLayout, InlineError, Link, Button} from '@shopify/polaris';
import Spinner from './Spinner.js'
import {Util, FormContext, useEffect, useApi} from '@thinkwell/react.common';
import map from 'lodash/map.js';

type Props = {
  url: string | ((form) => string)
  submitError?: string,
  submitting?: boolean,
  onSuccess?: (data) => void,
  onSubmitting?: (boolean) => void,
  onError?: (string) => void,
  useHtml?: boolean,
  method?: string | (() => string),
  headers?: any,
  submitRef?: MutableRefObject<(extraData?) => void>,
  children?: any,
  submitText?: string,
  submitButton?: string,
  style?: CSSProperties
}

export default function Form(props:Props) {
  const form = useContext(FormContext)
  const formRef = useRef() as MutableRefObject<HTMLFormElement>;
  const [fileDownloadToken, setFileDownloadToken] = useState(Math.random().toString(36).substring(7))
  const [submitting, setSubmitting] = useState(false)
  const [submitClicked, setSubmitClicked] = useState(false)
  const [submitError, setSubmitError] = useState(props.submitError)
  const api = useApi()
  
  useEffect(() => setSubmitting(props.submitting), [props.submitting]);
  useEffect(() => setSubmitError(props.submitError), [props.submitError]);

  const onSuccess = (res) => {
    const data = res.data || res
    if(data.status && data.status == 'error') {
      onError(data)
      return
    }

    // redirect if data.redirect_url or data.location is set
    if (data && (data.redirect_url || data.location)) {
      return Util.redirect(data)
    } else {
      onSubmitting(false)
      props.onSuccess && props.onSuccess(data)
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
    const errorMessage = data && data.errors && formatErrors(data.errors) || data && data.message || error.message;

    onSubmitting(false)
    // if error is handled from parent delegate else set state
    if (props.onError) {
      props.onError(errorMessage)
    } else {
      setSubmitError(errorMessage)
    }
  }

  const submit = (extraData?) => {
    onSubmitting(true)
    if (!props.useHtml) {
      const formData = Object.assign({}, form.data(), extraData || {})
      const method = props.method ? (typeof props.method == 'function' ? props.method() : props.method) : 'put' as any;
      const url = typeof props.url == 'function' ? props.url(form) : props.url;
      const data = {};
      data[form.rootName || "item"] = formData
      const config = {method: method, url: url, data: data} as any
      if(props.headers) {
        config.headers = props.headers
      }
      return api(config)
      .then(onSuccess)
      .catch(onError)
    } else {
      let attempts = 30;
      const getCookie = ( name ) => {
        var parts = window.document.cookie.split(name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
      }
      const expireCookie = ( cName ) => {
        window.document.cookie = encodeURIComponent(cName) + "=deleted; expires=" + new Date( 0 ).toUTCString();
      }
      let interval;
      interval = setInterval(() => {
        attempts--;
        const cookie = getCookie('fileDownloadToken')
        let cookieValueObj = {value: undefined, result: undefined}
        try {
          cookieValueObj = cookie && JSON.parse(decodeURIComponent(cookie))
        } catch (error) {
          console.error(`fileDownloadToken : could not parse cookie : ${decodeURIComponent(cookie)}`)
        }
        const token = cookieValueObj && cookieValueObj.value
        if (token == fileDownloadToken || attempts <= 0) {
          clearInterval(interval)
          onSubmitting(false)
          expireCookie('fileDownloadToken')
          setFileDownloadToken(Math.random().toString(36).substring(7))
          onSuccess({data: cookieValueObj.result || {}})
          return;
        }
      }, 1000);

      formRef.current.submit()
    }
  }

  if (props.submitRef) {
    props.submitRef.current = submit
  }

  const onClick = (event?) => {
    event.preventDefault();
    setSubmitClicked(true);
    if(!form.errors().length) {
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
  const formErrors = form.errors()
  return (
    <div style={props.style}>
      { submitError ?
        <InlineError message={submitError} fieldID="submitErrorFieldID" />
      : null }
      { submitClicked && formErrors.length ?
        <InlineError message={(<div> {formErrors.map((error, index) => (<div key={index}>{error}</div>)) } </div>)} fieldID="validationErrorFieldID" />
      : null }
      { !props.useHtml ?
        formLayout :
        <form method="post" action={typeof props.url == 'function' ? props.url(form) : props.url} acceptCharset="UTF-8" ref={formRef} className="form">
          {formLayout}
          <input type="hidden" name="fileDownloadToken" value={fileDownloadToken} />
        </form>
      }
    </div>
  );
}
