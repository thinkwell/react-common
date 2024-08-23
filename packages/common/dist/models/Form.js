import { useState, useRef } from 'react';
import useReducerForm from '../hooks/useReducerForm.js';
import Util from '../Util.js';
import values from 'lodash/values.js';
import omit from 'lodash/omit.js';
import get from 'lodash/get.js';
import mergeWith from 'lodash/mergeWith.js';
export default function Form(props) {
    const scope = props.scope || 'data';
    const [initialData] = useState(props.data && props.data[scope] || props.data || {});
    const [formState, onAction] = useReducerForm({}, initialData);
    const [validations, setValidations] = useState({});
    const children = useRef({});
    const register = (name, validator) => {
        validations[scope] = validations[scope] || {};
        validations[scope][name] = validator;
        setValidations(validations);
    };
    const validate = () => {
        const validators = validations[scope];
        if (!validators) {
            return [];
        }
        const errors = Object.keys(validators).map((name) => {
            const value = obj.field(name);
            return { [name]: validators[name](value, obj) };
        });
        return errors;
    };
    const isInt = (value) => {
        return !isNaN(value) &&
            parseInt(value) == value &&
            !isNaN(parseInt(value, 10));
    };
    const obj = {
        field: (name) => {
            const data = mergeWith({}, props.data && props.data[scope] || props.data, formState.data, formState[scope], (objValue, srcValue, key) => {
                // merge with default for arrays
                if (isInt(key)) {
                    return;
                }
                // don't merge arrays but assign src array
                if (Array.isArray(objValue) && Array.isArray(srcValue)) {
                    return srcValue;
                }
                if (typeof objValue != 'undefined' && typeof srcValue == 'undefined') {
                    return null;
                }
            });
            if (Array.isArray(name)) {
                return get(data, name);
            }
            else {
                return data[name];
            }
        },
        data: () => {
            const childrenData = values(children.current).map((form) => form.data());
            const data = mergeWith({}, props.data && props.data[scope] || props.data, formState.data, formState[scope], ...childrenData, (objValue, srcValue, key) => {
                // merge with default for arrays
                if (isInt(key)) {
                    return;
                }
                // don't merge arrays but assign src array
                if (Array.isArray(objValue) && Array.isArray(srcValue)) {
                    return srcValue;
                }
                if (typeof objValue != 'undefined' && typeof srcValue == 'undefined') {
                    return null;
                }
            });
            const value = omit(data, props.omit || []);
            return props.format && props.format(value) || value;
        },
        errors: () => {
            const errorsObj = validate();
            const childrenErrors = values(children.current).map((form) => form.errors());
            const result = Util.flattenDeep(Object.assign({}, errorsObj, ...childrenErrors));
            return result;
        },
        onData: (name) => {
            return onAction(scope, name);
        },
        register: register,
        setChild: (name, form) => {
            children.current = Object.assign({}, children.current, { [name]: form });
        },
        rootName: props.rootName
    };
    if (props.parent) {
        if (!props.name) {
            throw `if parent specified, name of child form must be specified too`;
        }
        props.parent.setChild(props.name, obj);
    }
    return obj;
}
