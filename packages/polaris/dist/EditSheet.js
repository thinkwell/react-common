import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useContext } from 'react';
import { Sheet, InlineError, Heading, Scrollable, Button } from '@shopify/polaris';
import { MobileCancelMajor } from '@shopify/polaris-icons';
import Form from './Form';
import Spinner from './Spinner';
import { FormContext, useReducerModal, useEffect } from '@thinkwell/react.common';
export default function EditSheet(props) {
    const form = useContext(FormContext);
    const onActiveProp = props.onActive;
    const [state, onActive, onSaveClicked, onSaveSubmitted, onSaveError, onSaving, onClear] = useReducerModal(Object.assign(Object.assign({}, props), { onActive: (active) => {
            onActiveProp && onActiveProp(active, form);
        } }), props.active);
    const submitRef = useRef(null);
    if (typeof props.active != 'undefined') {
        useEffect(() => { onActive(props.active); }, [props.active]);
    }
    const save = () => {
        onSaveClicked();
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
                    _jsx("button", { className: props.linkClass || 'Polaris-Link', onClick: () => onActive(true), children: linkText || title }) }), _jsx(Sheet, { accessibilityLabel: '', open: state.active, onEntered: props.onTransitionEnd, onClose: () => onActive(false), children: _jsxs("div", { style: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }, children: [_jsxs("div", { style: {
                                alignItems: 'center',
                                borderBottom: '1px solid #DFE3E8',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '1.6rem',
                                width: '100%',
                            }, children: [_jsx(Heading, { children: title }), _jsx(Button, { accessibilityLabel: "Cancel", icon: MobileCancelMajor, onClick: () => onActive(false), plain: true })] }), _jsxs(Scrollable, { style: { padding: '1.6rem', height: '100%' }, children: [state.saveClicked && form.errors.length ?
                                    _jsx(InlineError, { message: (_jsxs("div", { children: [" ", form.errors.map((error) => (_jsx("div", { children: error }, error))), " "] })), fieldID: "validationErrorFieldID" })
                                    : null, state.saveError ?
                                    _jsx(InlineError, { message: (_jsx("div", { className: "submit-error", children: state.saveError })), fieldID: "submitErrorFieldID" })
                                    : null, _jsx("div", { className: state.saving ? 'saving' : '', children: _jsx(Form, { onError: onSaveError, onSuccess: onSuccess, submitRef: submitRef, method: props.method, url: props.url, onSubmitting: onSaving, children: props.children }) })] }), _jsxs("div", { style: {
                                alignItems: 'center',
                                borderTop: '1px solid #DFE3E8',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '1.6rem',
                                width: '100%',
                            }, children: [_jsx(Button, { onClick: () => onActive(false), children: "Cancel" }), typeof saveText != 'undefined' && !saveText ? null :
                                    _jsx(Button, { primary: true, loading: state.saving, onClick: save, children: saveText || 'Save' })] })] }) })] }));
}
