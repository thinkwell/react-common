import React, { useState, useRef, useContext, RefObject, ReactElement, JSXElementConstructor, MutableRefObject } from 'react';
import {FormLayout, Modal, InlineError} from '@shopify/polaris';
import Form from './Form.js';
import Spinner from './Spinner.js';
import {Util, FormContext, useReducerModal, useEffect} from '@thinkwell/react.common';

export interface IEditModal {
  saveRef?: MutableRefObject<() => void>;
  clearRef?: MutableRefObject<() => void>;
  setActiveRef?: MutableRefObject<(boolean) => void>;
  setSavingRef?: MutableRefObject<(boolean) => void>;
  linkText?: string | ReactElement | ((string) => string);
  saveText?: string | ((string) => string);
  title?: string | ((string) => string);
  className?: string | undefined;
  linkClass?: string;
  activator?: RefObject<HTMLElement> | ReactElement<any, string | JSXElementConstructor<any>> | undefined;
  onTransitionEnd?: (() => void) | undefined;
  method?: string;
  headers?: string;
  url?: string | ((form) => string);
  children?: any;
  onActive?: (active, form?) => void;
  onSave?: (T, form?) => void;
  onSaving?: (boolean) => void;
  active?: boolean;
}

export default function EditModal<S extends IEditModal>(props:S) {
  const form = useContext(FormContext)

  const onActiveProp = props.onActive
  const [state, onActive, onSaveClicked, onSaveSubmitted, onSaveError, onSaving, onClear] = useReducerModal({...props, onActive: (active) => {
    onActiveProp && onActiveProp(active, form)
  }}, props.active)

  const submitRef = useRef() as MutableRefObject<() => void>;

  if(typeof props.active != 'undefined') {
    useEffect(() => { onActive(props.active) }, [props.active]);
  }

  const save = () => {
    onSaveClicked()
    console.log(`EditModal#save`)
    const formErrors = form.errors()
    if (formErrors.length) {
      console.log(`validation errors : ${JSON.stringify(formErrors)}`)
    } else {
      submitRef.current()
      onSaveSubmitted()
    }
  }

  const onSuccess = (response) => {
    onActive(false)
    form.onData(null)({})
    props.onSave && props.onSave(response, form)
  }

  if (props.saveRef) {
    props.saveRef.current = save
  }

  if (props.clearRef) {
    props.clearRef.current = onClear
  }

  if (props.setActiveRef) {
    props.setActiveRef.current = onActive
  }

  if (props.setSavingRef) {
    props.setSavingRef.current = onSaving
  }

  const linkText = props.linkText && (typeof props.linkText == 'function' ? props.linkText(form) : props.linkText)
  const saveText = props.saveText && (typeof props.saveText == 'function' ? props.saveText(form) : props.saveText)
  const title = props.title && (typeof props.title == 'function' ? props.title(form) : props.title)
  const formErrors = form.errors()

  return (
    <div className={props.className}>
      <Spinner active={state.saving}>
        { typeof props.active != 'undefined' ?
          <span className="link-text">{linkText || title}</span> :
          <button className={props.linkClass || 'Polaris-Link'} onClick={() => onActive(true)}>{linkText || title}</button>
        }
      </Spinner>
      <Modal
        activator={props.activator}
        open={state.active}
        onTransitionEnd={props.onTransitionEnd}
        onClose={() => onActive(false)}
        title={title}
        primaryAction={typeof saveText != 'undefined' && !saveText ? undefined : {
          content: saveText || 'Save',
          onAction: save,
          loading: state.saving
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => onActive(false),
          },
        ]}
      >
        <Modal.Section>
        { state.saveClicked && formErrors.length ?
          <InlineError message={(<div> {formErrors.map((error) => (<div key={error}>{error}</div>)) } </div>)} fieldID="validationErrorFieldID" />
        : null }
        { state.saveError ?
          <InlineError message={(<div className="submit-error">{state.saveError}</div>)} fieldID="submitErrorFieldID" />
        : null }
          <div className={state.saving ? 'saving' : ''}>
            <Form
              onError={onSaveError}
              onSuccess={onSuccess}
              submitRef={submitRef}
              method={props.method}
              headers={props.headers}
              url={props.url}
              onSubmitting={onSaving}
            >
              {props.children}
            </Form>
          </div>
        </Modal.Section>
      </Modal>
    </div>
  );
}
