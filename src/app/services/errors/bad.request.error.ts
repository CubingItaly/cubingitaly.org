

export class BadRequestError extends Error {
    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype)
    }
}