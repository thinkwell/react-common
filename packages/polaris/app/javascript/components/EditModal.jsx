import React, { useState, useRef, useContext } from 'react';
import {FormLayout, Modal, InlineError, Link, TextStyle} from '@shopify/polaris';
import Form from './Form';
import Spinner from './Spinner';
import {Util, FormContext, useReducerModal, useEffect} from '@thinkwell/react.common';

export default function EditModal(props) {
  const form = useContext(FormContext)

  const onActiveProp = props.onActive
  const [state, onActive, onSaveClicked, onSaveSubmitted, onSaveError, onSaving, onClear] = useReducerModal({...props, onActive: (active) => {
    onActiveProp && onActiveProp(active, form)
  }}, props.active)

  const submitRef = useRef(null);

  if(typeof props.active != 'undefined') {
    useEffect(() => { onActive(props.active) }, [props.active]);
  }

  const save = () => {
    onSaveClicked()
    if (form.errors.length) {
      console.error(`validation errors : ${JSON.stringify(form.errors)}`)
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
        primaryAction={typeof saveText != 'undefined' && !saveText ? null : {
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
        { state.saveClicked && form.errors.length ?
          <InlineError message={(<div> {form.errors.map((error) => (<div key={error}>{error}</div>)) } </div>)} fieldID="validationErrorFieldID" />
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
