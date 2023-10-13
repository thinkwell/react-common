import React from 'react';
import useReducer from './useReducer'
import {TabsProps} from '@shopify/polaris'

type TabState = {
  tabIndexSelected: number,
  tabSelected: string
}

export default function useReducerTab (props, tabs:TabsProps['tabs'], tabSelected?: string):[TabState, (tabSelected: number) => void] {
  function reducer(state, action, attribute) {
    const payload = action.payload
    switch (action.type) {
      case 'onTabSelected':
        const tabSelected = tabs[payload].id
        return {...state,
          tabIndexSelected: payload,
          tabSelected: tabSelected
        };
    }
  }

  tabSelected = tabSelected || tabs[0].id
  let tabIndexSelected = tabs.findIndex((tab) => tab.id == tabSelected)
  const initialArg = {tabSelected: tabSelected, tabIndexSelected: tabIndexSelected}
  const [state, dispatch, onAction] = useReducer(props, initialArg, reducer)

  const onTabSelected = onAction('onTabSelected')

  return [state, onTabSelected]
}
