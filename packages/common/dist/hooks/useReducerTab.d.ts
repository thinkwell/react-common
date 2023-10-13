import { TabsProps } from '@shopify/polaris';
type TabState = {
    tabIndexSelected: number;
    tabSelected: string;
};
export default function useReducerTab(props: any, tabs: TabsProps['tabs'], tabSelected?: string): [TabState, (tabSelected: number) => void];
export {};
