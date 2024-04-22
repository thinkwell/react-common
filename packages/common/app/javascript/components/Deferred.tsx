/**
 * A promise wrapper that can be resolved or rejected at a later point in time
 *
 * Based on jQuery Deferred: https://api.jquery.com/category/deferred-object/
 */
export default class Deferred<T = unknown> {
	private _promise: Promise<T>;

	/**
	 * Resolves the promise with given value.
	 */
	public resolve!: (value: T | PromiseLike<T>) => void;

	/**
	 * Reject the promise with given reason.
	 */
	public reject!: (reason?: unknown) => void;

	/**
	 * Get the underlying promise that can be awaited.
	 */
	public get promise(): Promise<T> {
		return this._promise;
	}

	public constructor() {
		this._promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
		Object.freeze(this);
	}
}