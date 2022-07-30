export class LoginNotFoundException extends Error {
  constructor(message?: string) {
    super(message);
    Error.captureStackTrace(this, LoginNotFoundException);
  }
}
