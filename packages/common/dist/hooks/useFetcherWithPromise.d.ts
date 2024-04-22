import type { FetcherWithComponents, SubmitFunction } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
type PromisifiedSubmitFunction<TData = unknown> = (...args: Parameters<SubmitFunction>) => Promise<TData>;
type FetcherWithPromisifiedSubmit<TData = unknown> = Omit<FetcherWithComponents<TData>, "submit"> & {
    submit: PromisifiedSubmitFunction<TData>;
};
/**
 * useFetcher() wrapper, where the only difference is that fetcher.submit()
 * returns a promise.
 *
 * Based on https://gist.github.com/samselikoff/510c020e4c9ec17f1cf76189ce683fa8
 * but using own Deferred.
 */
export default function useFetcherWithPromise<TData = unknown>(): FetcherWithPromisifiedSubmit<SerializeFrom<TData>>;
export {};
