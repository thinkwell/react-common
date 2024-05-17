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
        var _a;
        deferredRef.current = new Deferred();
        try {
            fetcher.submit(...args);
            return deferredRef.current.promise;
        }
        catch (error) {
            (_a = deferredRef.current) === null || _a === void 0 ? void 0 : _a.reject(error);
            deferredRef.current = undefined;
        }
    };
    const load = (...args) => {
        var _a;
        deferredRef.current = new Deferred();
        try {
            fetcher.load(...args);
            return deferredRef.current.promise;
        }
        catch (error) {
            (_a = deferredRef.current) === null || _a === void 0 ? void 0 : _a.reject(error);
            deferredRef.current = undefined;
        }
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
