export class InvalidMimeTypeException extends Error {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, InvalidMimeTypeException);
  }
}
