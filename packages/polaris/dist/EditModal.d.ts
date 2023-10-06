import { RefObject, ReactElement, JSXElementConstructor, MutableRefObject } from 'react';
export interface IEditModal {
    saveRef?: MutableRefObject<() => void>;
    clearRef?: MutableRefObject<() => void>;
    setActiveRef?: MutableRefObject<(boolean: any) => void>;
    setSavingRef?: MutableRefObject<(boolean: any) => void>;
    linkText?: string | ((string: any) => string);
    saveText?: string | ((string: any) => string);
    title?: string | ((string: any) => string);
    className?: string | undefined;
    linkClass?: string;
    activator?: RefObject<HTMLElement> | ReactElement<any, string | JSXElementConstructor<any>> | undefined;
    onTransitionEnd?: (() => void) | undefined;
    method?: string;
    headers?: string;
    url?: string | ((form: any) => string);
    children?: any;
    onActive?: (active: any, form?: any) => void;
    onSave?: (T: any, form?: any) => void;
    onSaving?: (boolean: any) => void;
    active?: boolean;
}
export default function EditModal<S extends IEditModal>(props: S): import("react/jsx-runtime").JSX.Element;
