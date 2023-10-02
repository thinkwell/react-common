import { jsx as _jsx } from "react/jsx-runtime";
import React, { useState } from 'react';
import enTranslations from '@shopify/polaris/locales/en.json';
import { AppProvider as AppProviderPolaris } from '@shopify/polaris';
export default function AppProvider(props) {
    return (_jsx(AppProviderPolaris, { i18n: enTranslations, children: props.children }));
}
