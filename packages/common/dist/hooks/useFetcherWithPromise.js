import * as React from "react";
import { useFetcher } from "@remix-run/react";
import Deferred from '../Deferred.js';
/**
 * useFetcher() wrapper, where the only difference is that fetcher.submit()
 * returns a promise.
 *
 * Based on https://gist.github.com/samselikoff/510c020e4c9ec17f1cf76189ce683fa8
 * but using own Deferred.
 */
export default function useFetcherWithPromise() {
    const fetcher = useFetcher();
    const deferredRef = React.useRef();
    const submit = (...args) => {
        deferredRef.current = new Deferred();
        fetcher.submit(...args);
        return deferredRef.current.promise;
    };
    const load = (...args) => {
        deferredRef.current = new Deferred();
        fetcher.load(...args);
        return deferredRef.current.promise;
    };
    React.useEffect(() => {
        var _a;
        // See fetcher states here:
        // https://remix.run/docs/en/v1/hooks/use-fetcher#fetchertype
        if (fetcher.state === "idle" && fetcher.data != null) {
            (_a = deferredRef.current) === null || _a === void 0 ? void 0 : _a.resolve(fetcher.data);
            deferredRef.current = undefined;
        }
    }, [fetcher.state, fetcher.data]);
    return Object.assign(Object.assign({}, fetcher), { submit, load });
}
