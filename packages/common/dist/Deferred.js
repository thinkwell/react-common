/**
 * A promise wrapper that can be resolved or rejected at a later point in time
 *
 * Based on jQuery Deferred: https://api.jquery.com/category/deferred-object/
 */
export default class Deferred {
    /**
     * Get the underlying promise that can be awaited.
     */
    get promise() {
        return this._promise;
    }
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        Object.freeze(this);
    }
}
