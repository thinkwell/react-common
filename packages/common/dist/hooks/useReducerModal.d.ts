type ModalState = {
    active: boolean;
    saveClicked: boolean;
    saveError: string;
    saving: boolean;
};
export default function useReducerModal(props: any, active: any): [ModalState, (active: boolean) => void, () => void, () => void, (saveError: string) => void, (saving: boolean) => void, () => void];
export {};
