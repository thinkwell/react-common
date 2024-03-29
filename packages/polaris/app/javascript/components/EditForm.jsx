import React, { useState, useRef, useContext } from 'react';
import {FormLayout, InlineError, Heading, Scrollable, Button, Card, Stack} from '@shopify/polaris';
import {MobileCancelMajor} from '@shopify/polaris-icons';
import Form from './Form';
import Spinner from './Spinner';
import {Util, FormContext, useReducerModal, useEffect} from '@thinkwell/react.common';

export default function EditForm(props) {
  const form = useContext(FormContext)

  const onActiveProp = props.onActive
  const ckEditorInstances = typeof CKEDITOR !== 'undefined' ? CKEDITOR.instances : {}

  const [state, onActive, onSaveClicked, onSaveSubmitted, onSaveError, onSaving, onClear] = useReducerModal({...props, onActive: (active) => {
    if(!active) {
      setTimeout(() => {
        if (typeof MathJax !== 'undefined') {
          MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        }
      }, 100)
    } else {
      // trigger when editor loads for autogrow
      setTimeout(() => {
        for (var key in ckEditorInstances) {
          ckEditorInstances[key].commands.autogrow.exec()
        }
      }, 100)
    }
    onActiveProp && onActiveProp(active, form)
  }}, props.active)

  const submitRef = useRef(null);

  if(typeof props.active != 'undefined') {
    useEffect(() => { onActive(props.active) }, [props.active]);
  }

  const save = () => {
    // hippo#76 : trigger blur on CKEditor instances on save
    // TODO : remove after moving to ckeditor v5
    for (var key in ckEditorInstances) {
      ckEditorInstances[key].focusManager.blur(true)
    }
    onSaveClicked()
    if (form.errors.length) {
      console.error(`validation errors : ${JSON.stringify(form.errors)}`)
    } else {
      // hippo#76 : setTimeout to allow CKTextArea#blur handler to fire
      // TODO : remove after moving to ckeditor v5
      while(true) {
        const isDirty = Object.keys(ckEditorInstances).find((key) => ckEditorInstances[key].checkDirty())
        if (!isDirty) {
          submitRef.current()
          onSaveSubmitted()
          break;
        } else {
          setTimeout(() => {}, 100)
        }
      }
    }
  }

  const onSuccess = (response) => {
    form.onData(null)({})
    onActive(false)
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
    <Card>
    <div className={props.className}>
      <div style={{display: state.active ? 'block' : 'none'}}><Card.Section>
        <Stack>
          <Stack.Item fill><Heading>{title}</Heading></Stack.Item>
          <Button
            accessibilityLabel="Cancel"
            icon={MobileCancelMajor}
            onClick={() => onActive(false)}
            plain
          />
        </Stack>
      </Card.Section>
      <Card.Section>
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
      </Card.Section>
      <Card.Section>
        <Stack>
          <Stack.Item fill><Button onClick={() => onActive(false)}>Cancel</Button></Stack.Item>
        {
          typeof saveText != 'undefined' && !saveText ? null :
            <Button primary loading={state.saving} onClick={save}>{saveText || 'Save'}</Button>
        }
        </Stack>
      </Card.Section>
    </div>
    </div>
    </Card>
  );
}
