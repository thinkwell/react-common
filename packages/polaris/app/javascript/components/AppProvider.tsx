import React, { useState, ReactElement} from 'react';
// @ts-ignore
import enTranslations from '@shopify/polaris/locales/en.json' assert { type: "json" };
import {AppProvider as AppProviderPolaris} from '@shopify/polaris';
import { LinkLikeComponent } from '@shopify/polaris/build/ts/src/utilities/link';

type Props = {
  children: any,
  linkComponent?: LinkLikeComponent
}

export default function AppProvider(props:Props) {
  return (<AppProviderPolaris i18n={enTranslations} linkComponent={props.linkComponent}>{props.children}</AppProviderPolaris>);
}
