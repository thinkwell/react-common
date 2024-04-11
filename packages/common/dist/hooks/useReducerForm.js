import useReducer from './useReducer.js';
import set from 'lodash/set.js';
export default function useReducerForm(props, data) {
    function reducer(state, action, attribute) {
        const payload = action.payload;
        switch (action.type) {
            case attribute:
                if (action.field) {
                    if (Array.isArray(action.field)) {
                        const attributeObj = set(Object.assign({}, state[attribute]), action.field, payload);
                        return Object.assign(Object.assign({}, state), { [attribute]: attributeObj });
                    }
                    else {
                        return Object.assign(Object.assign({}, state), { [attribute]: Object.assign(Object.assign({}, state[attribute]), { [action.field]: payload }) });
                    }
                }
                else {
                    return Object.assign(Object.assign({}, state), { [attribute]: payload });
                }
        }
    }
    const [state, dispatch, onAction] = useReducer(props, data, reducer);
    return [state, onAction];
}
