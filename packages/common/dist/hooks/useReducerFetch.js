import useReducer from './useReducer';
export default function useReducerFetch(props, value) {
    function reducer(state, action, attribute) {
        const payload = action.payload;
        switch (action.type) {
            case 'onFetch':
                return Object.assign(Object.assign({}, state), { loading: true, error: null });
            case 'onSuccess':
                return Object.assign(Object.assign({}, state), { loading: false, items: payload });
            case 'onError':
                const errorMessage = payload.response && payload.response.data && payload.response.data.message || payload.message;
                return Object.assign(Object.assign({}, state), { loading: false, error: errorMessage });
        }
    }
    const initialArg = {};
    const [state, dispatch, onAction] = useReducer(props, initialArg, reducer);
    const onFetch = onAction('onFetch');
    const onSuccess = onAction('onSuccess');
    const onError = onAction('onError');
    return [state, onFetch, onSuccess, onError];
}
