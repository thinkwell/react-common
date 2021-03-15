import React, { useState, useEffect, useRef, useContext } from 'react';
import {FormLayout, InlineError, Heading, Scrollable, Button} from '@shopify/polaris';
import {MobileCancelMajor} from '@shopify/polaris-icons';
import Form from './Form';
import Spinner from './Spinner';
import Util from './Util';
import {FormContext} from './contexts/Form'
import useReducerModal from './hooks/useReducerModal'

export default function EditForm(props) {
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
      { state.active ?
        (<div
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
            <Heading>{title}</Heading>
            <Button
              accessibilityLabel="Cancel"
              icon={MobileCancelMajor}
              onClick={() => onActive(false)}
              plain
            />
          </div>
          <Scrollable style={{padding: '1.6rem', height: '100%'}}>
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
                <Button primary loading={state.saving} onClick={save}>{saveText || 'Save'}</Button>
            }
          </div>
      </div>) : null
    }
    </div>
  );
}
