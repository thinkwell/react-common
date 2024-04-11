import useReducer from './useReducer.js';
export default function useReducerModal(props, active) {
    function reducer(state, action, attribute) {
        const payload = action.payload;
        switch (action.type) {
            case 'onActive':
                // shopper-114 : clear save error when modal closes
                if (!payload) {
                    return Object.assign(Object.assign({}, state), { active: payload, saveClicked: false, saveError: null });
                }
                else {
                    return Object.assign(Object.assign({}, state), { active: payload });
                }
            case 'onClear':
                return Object.assign(Object.assign({}, state), { saveClicked: false, saveError: null });
            case 'onSaveError':
                return Object.assign(Object.assign({}, state), { saveError: payload });
            case 'onSaveClicked':
                return Object.assign(Object.assign({}, state), { saveClicked: true });
            case 'onSaveSubmitted':
                return Object.assign(Object.assign({}, state), { saveError: null, saving: true });
            case 'onSaving':
                return Object.assign(Object.assign({}, state), { saving: payload });
        }
    }
    // trigger props listeners on init
    const init = (active) => {
        if (!!active) {
            props.onActive && props.onActive(active);
        }
        return { active: active };
    };
    const [state, dispatch, onAction] = useReducer(props, active, reducer, init);
    const onActive = onAction('onActive');
    const onSaveSubmitted = onAction('onSaveSubmitted');
    const onSaveClicked = onAction('onSaveClicked');
    const onSaveError = onAction('onSaveError');
    const onSaving = onAction('onSaving');
    const onClear = onAction('onClear');
    return [state, onActive, onSaveClicked, onSaveSubmitted, onSaveError, onSaving, onClear];
}
