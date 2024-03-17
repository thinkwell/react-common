import { jsx as _jsx } from "react/jsx-runtime";
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider as AppProviderPolaris } from '@shopify/polaris';
export default function AppProvider(props) {
    return (_jsx(AppProviderPolaris, { i18n: enTranslations, linkComponent: props.linkComponent, children: props.children }));
}