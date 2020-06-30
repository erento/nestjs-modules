export class UtilsError extends Error {
    constructor (message?: string) {
        super(message);
        Object.setPrototypeOf(this, UtilsError.prototype);
    }
}
