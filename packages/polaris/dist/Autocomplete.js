var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useContext, useRef } from 'react';
import { Autocomplete as AutocompletePolaris, Icon } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { FormContext } from '@thinkwell/react.common';
import axios from 'axios';
export default function Autocomplete(props) {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState(props.value);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const timeout = useRef(null);
    if (!props.name) {
        throw `Property name is required for Autocomplete ${props.label}`;
    }
    const form = useContext(FormContext);
    const nameHtml = Array.isArray(props.name) ? props.name.join('_') : props.name;
    const id = props.id || nameHtml;
    const value = form.field(props.name);
    const onChange = (value) => {
        form.onData(props.name)(value);
        props.onChange && props.onChange(value, form);
    };
    const handleKeyPress = (event) => {
        const enterKeyPressed = event.keyCode === 13;
        if (enterKeyPressed) {
            props.onEnterPressed && props.onEnterPressed();
        }
    };
    const validate = () => {
        const errors = [];
        const value = form.field(props.name);
        const valueAsString = value && value.toString();
        if (props.required && (!valueAsString || !valueAsString.length)) {
            errors.push("Required " + props.label);
        }
        return errors;
    };
    form.register(props.name, validate);
    const formatLabel = props.formatLabel || ((value) => {
        return value[props.valueProp];
    });
    const updateText = (value) => {
        setInputValue(value);
        if (value.length < 2) {
            return;
        }
        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = null;
        }
        timeout.current = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            timeout.current = null;
            setLoading(true);
            const url = new URL(props.url);
            url.searchParams.set('query', encodeURIComponent(value));
            if (props.limit) {
                url.searchParams.set('limit', props.limit);
            }
            const response = yield axios({ method: 'get', url: url.toString() });
            // Format data into JSON
            const data = response.data;
            const resultOptions = (data.items || data).map((result) => {
                return {
                    value: result,
                    label: formatLabel(result)
                };
            });
            setOptions(resultOptions);
            setLoading(false);
        }), 500);
    };
    const updateSelection = (selectedItems) => {
        const idProp = props.idProp || 'id';
        const selected = selectedItems.map((selectedItem) => {
            return options.find((option) => option.value[idProp] == selectedItem[idProp]);
        }).pop();
        form.onData(props.name)(selected && selected.value[idProp]);
        setInputValue(formatLabel(selected.value));
        setSelectedOptions([selected]);
    };
    const onClearButtonClick = () => {
        setInputValue('');
        setOptions([]);
        setSelectedOptions([]);
        form.onData(props.name)(null);
    };
    const textField = (_jsx(AutocompletePolaris.TextField, { autoComplete: '', onChange: updateText, value: inputValue, label: props.label, clearButton: true, onClearButtonClick: onClearButtonClick, prefix: _jsx(Icon, { source: SearchMinor, color: "base" }), placeholder: props.placeholder || `Search ${props.label}` }));
    return (_jsx("div", { onKeyDown: handleKeyPress, children: _jsx(AutocompletePolaris, { allowMultiple: false, options: options, selected: selectedOptions, onSelect: updateSelection, loading: loading, textField: textField }) }));
}
