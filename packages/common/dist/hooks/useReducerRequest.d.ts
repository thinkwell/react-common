type RequestState = {
    requesting: boolean;
    error: string;
};
export default function useReducerRequest(method: string, props: any): [RequestState, (url: string, data?: any, confirmMsg?: string) => Promise<any>];
export interface RequestStateProps {
    requesting: boolean;
    error: string;
}
export {};
