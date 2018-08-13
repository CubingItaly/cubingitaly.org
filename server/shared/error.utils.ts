export function sendError(res, code: number, message: string) {
    let error = {
        error: code,
        message: message
    }
    res.status(code).json(error);
}
