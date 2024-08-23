import React, { useState, useRef, useContext } from 'react';
import {FormLayout, Sheet, InlineError, Text, Scrollable, Button} from '@shopify/polaris';
import {XIcon} from '@shopify/polaris-icons';
import Form from './Form.js';
import Spinner from './Spinner.js';
import {Util, FormContext, useReducerModal, useEffect} from '@thinkwell/react.common';
import { IEditModal } from './EditModal.js';

type Props = IEditModal & {

}

export default function EditSheet(props) {
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
    const formErrors = form.errors()
    if (formErrors.length) {
      console.error(`validation errors : ${JSON.stringify(formErrors)}`)
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
      <Sheet
        accessibilityLabel=''
        open={state.active}
        onEntered={props.onTransitionEnd}
        onClose={() => onActive(false)}
      >
      <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              borderBottom: '1px solid #DFE3E8',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1.6rem',
              width: '100%',
            }}
          >
            <Text variant="headingMd" as="h2">{title}</Text>
            <Button
              accessibilityLabel="Cancel"
              icon={XIcon}
              onClick={() => onActive(false)}
              variant="plain"
            />
          </div>
          <Scrollable style={{padding: '1.6rem', height: '100%'}}>
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
                url={props.url}
                onSubmitting={onSaving}
              >
                {props.children}
              </Form>
            </div>
          </Scrollable>
          <div
            style={{
              alignItems: 'center',
              borderTop: '1px solid #DFE3E8',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1.6rem',
              width: '100%',
            }}
          >
            <Button onClick={() => onActive(false)}>Cancel</Button>
            {
              typeof saveText != 'undefined' && !saveText ? null :
                <Button variant="primary" loading={state.saving} onClick={save}>{saveText || 'Save'}</Button>
            }
          </div>
        </div>
      </Sheet>
    </div>
  );
}
