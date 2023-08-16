var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import useReducer from './useReducer';
import api from '../services/api';
export default function useReducerRequest(method, props) {
    function reducer(state, action) {
        const payload = action.payload;
        switch (action.type) {
            case 'onSuccess':
                return Object.assign(Object.assign({}, state), { requesting: false });
            case 'onRequesting':
                return Object.assign(Object.assign({}, state), { requesting: true });
            case 'onError':
                const errorMessage = payload.response && payload.response.data && payload.response.data.message || payload.message;
                return Object.assign(Object.assign({}, state), { requesting: false, error: errorMessage });
        }
    }
    const initialArg = {};
    const [state, dispatch, onAction] = useReducer(props, initialArg, reducer);
    const onSuccess = onAction('onSuccess');
    const onRequesting = onAction('onRequesting');
    const onError = onAction('onError');
    const onRequest = (url, data, confirmMsg) => __awaiter(this, void 0, void 0, function* () {
        if (confirmMsg && !confirm(confirmMsg)) {
            return;
        }
        try {
            onRequesting();
            api.defaults.headers.common['X-CSRF-Token'] = document.querySelector("meta[name=csrf-token]").content;
            const config = { method: method, url: url };
            if (data) {
                config.data = data;
            }
            const response = yield api(config);
            onSuccess(response);
            return response;
        }
        catch (error) {
            onError(error);
        }
    });
    return [state, onRequest];
}