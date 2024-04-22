import * as React from "react";
import type { FetcherWithComponents, SubmitFunction } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import type { SerializeFrom } from "@remix-run/server-runtime";
import Deferred from '../Deferred.js'

type PromisifiedSubmitFunction<TData = unknown> = (
	...args: Parameters<SubmitFunction>
) => Promise<TData>;

type FetcherWithPromisifiedSubmit<TData = unknown> = Omit<
	FetcherWithComponents<TData>,
	"submit"
> & { submit: PromisifiedSubmitFunction<TData> };

/**
 * useFetcher() wrapper, where the only difference is that fetcher.submit()
 * returns a promise.
 *
 * Based on https://gist.github.com/samselikoff/510c020e4c9ec17f1cf76189ce683fa8
 * but using own Deferred.
 */
export default function useFetcherWithPromise<
	TData = unknown,
>(): FetcherWithPromisifiedSubmit<SerializeFrom<TData>> {
	const fetcher = useFetcher<TData>();
	const deferredRef = React.useRef<Deferred<SerializeFrom<TData>>>();

	const submit: FetcherWithPromisifiedSubmit<SerializeFrom<TData>>["submit"] = (
		...args
	) => {
		deferredRef.current = new Deferred();
		fetcher.submit(...args);
		return deferredRef.current.promise;
	};

	const load: FetcherWithPromisifiedSubmit<SerializeFrom<TData>>["load"] = (
		...args
	) => {
		deferredRef.current = new Deferred();
		fetcher.load(...args);
		return deferredRef.current.promise;
	};

	React.useEffect(() => {
		// See fetcher states here:
		// https://remix.run/docs/en/v1/hooks/use-fetcher#fetchertype
		if (fetcher.state === "idle" && fetcher.data != null) {
			deferredRef.current?.resolve(fetcher.data);
			deferredRef.current = undefined;
		}
	}, [fetcher.state, fetcher.data]);

	return { ...fetcher, submit, load };
}