import useReducer from './useReducer.js';
export default function useReducerItem(props, fieldsToEdit) {
    function reducer(state, action, attribute) {
        const payload = action.payload;
        switch (action.type) {
            case 'onEdit':
                return Object.assign(Object.assign({}, state), { [attribute]: Object.assign(Object.assign({}, state[attribute]), { [action.field]: payload }) });
        }
    }
    const edit = fieldsToEdit.reduce((obj, field) => {
        obj[field] = false;
        return obj;
    }, {});
    const initialArg = { edit: edit };
    const [state, dispatch, onAction] = useReducer(props, initialArg, reducer);
    const onEdit = (field) => onAction('onEdit', field);
    return [state, onEdit];
}
