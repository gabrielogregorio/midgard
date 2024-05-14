export class CustomError {
  message: string;

  error: unknown;

  constructor(message: string, error: unknown = undefined) {
    this.message = message;
    this.error = error;
  }
}
