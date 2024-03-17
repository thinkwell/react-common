import React, { useState, ReactElement} from 'react';
import enTranslations from '@shopify/polaris/locales/en.json';
import {AppProvider as AppProviderPolaris} from '@shopify/polaris';
import { LinkLikeComponent } from '@shopify/polaris/build/ts/latest/src/utilities/link';

type Props = {
  children: any,
  linkComponent?: LinkLikeComponent
}

export default function AppProvider(props:Props) {
  return (<AppProviderPolaris i18n={enTranslations} linkComponent={props.linkComponent}>{props.children}</AppProviderPolaris>);
}