import React, { useState } from 'react';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider as AppProviderPolaris} from '@shopify/polaris';

export default function AppProvider(props) {
  return (<AppProviderPolaris i18n={enTranslations}>{props.children}</AppProviderPolaris>);
}
