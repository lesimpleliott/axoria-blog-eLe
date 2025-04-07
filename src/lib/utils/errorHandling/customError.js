export default class AppError extends Error {
  constructor(message = "An error as occured") {
    super(message);
    this.name = "AppError";
  }
}
