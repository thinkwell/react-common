import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useContext } from 'react';
import { FormLayout, InlineError, Button } from '@shopify/polaris';
import Spinner from './Spinner.js';
import { Util, FormContext, useEffect, api } from '@thinkwell/react.common';
import map from 'lodash/map.js';
export default function Form(props) {
    const form = useContext(FormContext);
    const formRef = useRef();
    const [fileDownloadToken, setFileDownloadToken] = useState(Math.random().toString(36).substring(7));
    const [submitting, setSubmitting] = useState(false);
    const [submitClicked, setSubmitClicked] = useState(false);
    const [submitError, setSubmitError] = useState(props.submitError);
    useEffect(() => setSubmitting(props.submitting), [props.submitting]);
    useEffect(() => setSubmitError(props.submitError), [props.submitError]);
    const onSuccess = (res) => {
        const data = res.data || res;
        if (data.status && data.status == 'error') {
            onError(data);
            return;
        }
        // redirect if data.redirect_url or data.location is set
        if (data && (data.redirect_url || data.location)) {
            return Util.redirect(data);
        }
        else {
            onSubmitting(false);
            props.onSuccess && props.onSuccess(data);
        }
    };
    const onSubmitting = (value) => {
        // if submitting is handled from parent delegate else set state
        if (props.onSubmitting) {
            props.onSubmitting(value);
        }
        else {
            setSubmitting(value);
        }
    };
    const formatErrors = (errors) => {
        return map(errors, (value, key) => key + ' ' + value);
    };
    const onError = (error) => {
        error.stack && console.error(error.stack);
        const data = error.response && error.response.data;
        const errorMessage = data && data.errors && formatErrors(data.errors) || data && data.message || error.message;
        onSubmitting(false);
        // if error is handled from parent delegate else set state
        if (props.onError) {
            props.onError(errorMessage);
        }
        else {
            setSubmitError(errorMessage);
        }
    };
    const submit = (extraData) => {
        onSubmitting(true);
        if (!props.useHtml) {
            const formData = Object.assign({}, form.data, extraData || {});
            const method = props.method ? (typeof props.method == 'function' ? props.method() : props.method) : 'put';
            const url = typeof props.url == 'function' ? props.url(form) : props.url;
            const data = {};
            data[form.rootName || "item"] = formData;
            const encType = "application/json";
            const config = { method: method, action: url, url: url, data: data, headers: {}, encType: encType };
            if (props.headers) {
                config.headers = props.headers;
            }
            return api(config)
                .then(onSuccess)
                .catch(onError);
        }
        else {
            let attempts = 30;
            const getCookie = (name) => {
                var parts = window.document.cookie.split(name + "=");
                if (parts.length == 2)
                    return parts.pop().split(";").shift();
            };
            const expireCookie = (cName) => {
                window.document.cookie = encodeURIComponent(cName) + "=deleted; expires=" + new Date(0).toUTCString();
            };
            let interval;
            interval = setInterval(() => {
                attempts--;
                const cookie = getCookie('fileDownloadToken');
                let cookieValueObj = { value: undefined, result: undefined };
                try {
                    cookieValueObj = cookie && JSON.parse(decodeURIComponent(cookie));
                }
                catch (error) {
                    console.error(`fileDownloadToken : could not parse cookie : ${decodeURIComponent(cookie)}`);
                }
                const token = cookieValueObj && cookieValueObj.value;
                if (token == fileDownloadToken || attempts <= 0) {
                    clearInterval(interval);
                    onSubmitting(false);
                    expireCookie('fileDownloadToken');
                    setFileDownloadToken(Math.random().toString(36).substring(7));
                    onSuccess({ data: cookieValueObj.result || {} });
                    return;
                }
            }, 1000);
            formRef.current.submit();
        }
    };
    if (props.submitRef) {
        props.submitRef.current = submit;
    }
    const onClick = (event) => {
        event.preventDefault();
        setSubmitClicked(true);
        if (!form.errors.length) {
            submit();
        }
    };
    const formLayout = (_jsxs(FormLayout, { children: [props.children, (props.submitText || props.submitButton) ?
                _jsxs(Spinner, { active: submitting, children: [props.submitText ?
                            _jsx("input", { className: "button", type: "submit", value: props.submitText, disabled: !!submitting, onClick: onClick })
                            : null, props.submitButton ?
                            _jsx(Button, { submit: true, disabled: !!submitting, onClick: onClick, children: props.submitButton })
                            : null] })
                : null] }));
    return (_jsxs("div", { style: props.style, children: [submitError ?
                _jsx(InlineError, { message: submitError, fieldID: "submitErrorFieldID" })
                : null, submitClicked && form.errors.length ?
                _jsx(InlineError, { message: (_jsxs("div", { children: [" ", form.errors.map((error, index) => (_jsx("div", { children: error }, index))), " "] })), fieldID: "validationErrorFieldID" })
                : null, !props.useHtml ?
                formLayout :
                _jsxs("form", { method: "post", action: typeof props.url == 'function' ? props.url(form) : props.url, acceptCharset: "UTF-8", ref: formRef, className: "form", children: [formLayout, _jsx("input", { type: "hidden", name: "fileDownloadToken", value: fileDownloadToken })] })] }));
}
