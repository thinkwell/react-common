import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useRef, useContext } from 'react';
import { FormLayout, InlineError, Text, Scrollable, Button, Card, LegacyStack } from '@shopify/polaris';
import { XIcon } from '@shopify/polaris-icons';
import Form from './Form.js';
import Spinner from './Spinner';
import { Util, FormContext, useReducerModal, useEffect } from '@thinkwell/react.common';
export default function EditForm(props) {
    const form = useContext(FormContext);
    const onActiveProp = props.onActive;
    const ckEditorInstances = typeof CKEDITOR !== 'undefined' ? CKEDITOR.instances : {};
    const [state, onActive, onSaveClicked, onSaveSubmitted, onSaveError, onSaving, onClear] = useReducerModal(Object.assign(Object.assign({}, props), { onActive: (active) => {
            if (!active) {
                setTimeout(() => {
                    if (typeof MathJax !== 'undefined') {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                    }
                }, 100);
            }
            else {
                // trigger when editor loads for autogrow
                setTimeout(() => {
                    for (var key in ckEditorInstances) {
                        ckEditorInstances[key].commands.autogrow.exec();
                    }
                }, 100);
            }
            onActiveProp && onActiveProp(active, form);
        } }), props.active);
    const submitRef = useRef(null);
    if (typeof props.active != 'undefined') {
        useEffect(() => { onActive(props.active); }, [props.active]);
    }
    const save = () => {
        // hippo#76 : trigger blur on CKEditor instances on save
        // TODO : remove after moving to ckeditor v5
        for (var key in ckEditorInstances) {
            ckEditorInstances[key].focusManager.blur(true);
        }
        onSaveClicked();
        if (form.errors.length) {
            console.error(`validation errors : ${JSON.stringify(form.errors)}`);
        }
        else {
            // hippo#76 : setTimeout to allow CKTextArea#blur handler to fire
            // TODO : remove after moving to ckeditor v5
            while (true) {
                const isDirty = Object.keys(ckEditorInstances).find((key) => ckEditorInstances[key].checkDirty());
                if (!isDirty) {
                    submitRef.current();
                    onSaveSubmitted();
                    break;
                }
                else {
                    setTimeout(() => { }, 100);
                }
            }
        }
    };
    const onSuccess = (response) => {
        form.onData(null)({});
        onActive(false);
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
    return (_jsx(Card, { children: _jsx("div", { className: props.className, children: _jsxs("div", { style: { display: state.active ? 'block' : 'none' }, children: [_jsx(Card.Section, { children: _jsxs(LegacyStack, { children: [_jsx(LegacyStack.Item, { fill: true, children: _jsx(Text, { variant: "headingMd", as: "h2", children: title }) }), _jsx(Button, { accessibilityLabel: "Cancel", icon: XIcon, onClick: () => onActive(false), plain: true })] }) }), _jsx(Card.Section, { children: _jsxs(Scrollable, { style: { padding: '1.6rem', height: '100%' }, children: [state.saveClicked && form.errors.length ?
                                    _jsx(InlineError, { message: (_jsxs("div", { children: [" ", form.errors.map((error) => (_jsx("div", { children: error }, error))), " "] })), fieldID: "validationErrorFieldID" })
                                    : null, state.saveError ?
                                    _jsx(InlineError, { message: (_jsx("div", { className: "submit-error", children: state.saveError })), fieldID: "submitErrorFieldID" })
                                    : null, _jsx("div", { className: state.saving ? 'saving' : '', children: _jsx(Form, { onError: onSaveError, onSuccess: onSuccess, submitRef: submitRef, method: props.method, url: props.url, onSubmitting: onSaving, children: props.children }) })] }) }), _jsx(Card.Section, { children: _jsxs(Stack, { children: [_jsx(Stack.Item, { fill: true, children: _jsx(Button, { onClick: () => onActive(false), children: "Cancel" }) }), typeof saveText != 'undefined' && !saveText ? null :
                                    _jsx(Button, { primary: true, loading: state.saving, onClick: save, children: saveText || 'Save' })] }) })] }) }) }));
}
