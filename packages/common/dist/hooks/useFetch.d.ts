import { FetchStateProps } from './useReducerFetch.js';
export default function useFetch<T>(props: any): [FetchStateProps, (url: any, params?: any) => Promise<T[]>];
