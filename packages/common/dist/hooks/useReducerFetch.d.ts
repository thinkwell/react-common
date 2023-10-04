export default function useReducerFetch(props: any, value: any): [FetchStateProps, (payload?: any) => void, (payload?: any) => void, (payload?: any) => void];
export interface FetchStateProps {
    loading: boolean;
    error: string;
}
