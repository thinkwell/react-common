/**
 * A promise wrapper that can be resolved or rejected at a later point in time
 *
 * Based on jQuery Deferred: https://api.jquery.com/category/deferred-object/
 */
export default class Deferred<T = unknown> {
    private _promise;
    /**
     * Resolves the promise with given value.
     */
    resolve: (value: T | PromiseLike<T>) => void;
    /**
     * Reject the promise with given reason.
     */
    reject: (reason?: unknown) => void;
    /**
     * Get the underlying promise that can be awaited.
     */
    get promise(): Promise<T>;
    constructor();
}
