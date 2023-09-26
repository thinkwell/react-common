type Props = {
    url?: string;
};
type UseFetchStateProps<T> = [T, boolean, (string: any) => Promise<Awaited<T>>];
export default function useFetchState<T>(props?: Props): UseFetchStateProps<T>;
export {};
