
export
class HashError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, HashError.prototype);
  }
}
