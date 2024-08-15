import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { flushSync } from 'react-dom';
import { useRef, useContext } from 'react';
import { Modal, InlineError } from '@shopify/polaris';
import Form from './Form.js';
import Spinner from './Spinner.js';
import { FormContext, useReducerModal, useEffect } from '@thinkwell/react.common';
export default function EditModal(props) {
    const form = useContext(FormContext);
    const onActiveProp = props.onActive;
    const [state, onActive, onSaveClicked, onSaveSubmitted, onSaveError, onSaving, onClear] = useReducerModal(Object.assign(Object.assign({}, props), { onActive: (active) => {
            onActiveProp && onActiveProp(active, form);
        } }), props.active);
    const submitRef = useRef();
    if (typeof props.active != 'undefined') {
        useEffect(() => { onActive(props.active); }, [props.active]);
    }
    const save = () => {
        flushSync(() => {
            onSaveClicked();
        });
        if (form.errors.length) {
            console.error(`validation errors : ${JSON.stringify(form.errors)}`);
        }
        else {
            submitRef.current();
            onSaveSubmitted();
        }
    };
    const onSuccess = (response) => {
        onActive(false);
        form.onData(null)({});
        props.onSave && props.onSave(response, form);
    };
    if (props.saveRef) {
        props.saveRef.current = save;
    }
    if (props.clearRef) {
        props.clearRef.current = onClear;
    }
    if (props.setActiveRef) {
        props.setActiveRef.current = onActive;
    }
    if (props.setSavingRef) {
        props.setSavingRef.current = onSaving;
    }
    const linkText = props.linkText && (typeof props.linkText == 'function' ? props.linkText(form) : props.linkText);
    const saveText = props.saveText && (typeof props.saveText == 'function' ? props.saveText(form) : props.saveText);
    const title = props.title && (typeof props.title == 'function' ? props.title(form) : props.title);
    return (_jsxs("div", { className: props.className, children: [_jsx(Spinner, { active: state.saving, children: typeof props.active != 'undefined' ?
                    _jsx("span", { className: "link-text", children: linkText || title }) :
                    _jsx("button", { className: props.linkClass || 'Polaris-Link', onClick: () => onActive(true), children: linkText || title }) }), _jsx(Modal, { activator: props.activator, open: state.active, onTransitionEnd: props.onTransitionEnd, onClose: () => onActive(false), title: title, primaryAction: typeof saveText != 'undefined' && !saveText ? undefined : {
                    content: saveText || 'Save',
                    onAction: save,
                    loading: state.saving
                }, secondaryActions: [
                    {
                        content: 'Cancel',
                        onAction: () => onActive(false),
                    },
                ], children: _jsxs(Modal.Section, { children: [state.saveClicked && form.errors.length ?
                            _jsx(InlineError, { message: (_jsxs("div", { children: [" ", form.errors.map((error) => (_jsx("div", { children: error }, error))), " "] })), fieldID: "validationErrorFieldID" })
                            : null, state.saveError ?
                            _jsx(InlineError, { message: (_jsx("div", { className: "submit-error", children: state.saveError })), fieldID: "submitErrorFieldID" })
                            : null, _jsx("div", { className: state.saving ? 'saving' : '', children: _jsx(Form, { onError: onSaveError, onSuccess: onSuccess, submitRef: submitRef, method: props.method, headers: props.headers, url: props.url, onSubmitting: onSaving, children: props.children }) })] }) })] }));
}
