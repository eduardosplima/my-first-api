export class AttachmentException extends Error {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, AttachmentException);
  }
}
