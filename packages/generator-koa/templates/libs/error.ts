export
class BadRequestError extends Error {
  constructor(message) {
    super(message); // 'Error' breaks prototype chain here
    this.name = 'BadRequestError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export
class NotFoundError extends Error {
  constructor(message) {
    super(message); // 'Error' breaks prototype chain here
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export
class ForbiddenError extends Error {
  constructor(message) {
    super(message); // 'Error' breaks prototype chain here
    this.name = 'ForbiddenError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export
class RequestValidationError extends Error {
  data = null;

  constructor(message, data) {
    super(message); // 'Error' breaks prototype chain here
    this.data = data;
    this.name = 'RequestValidationError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export
class ResponseValidationError extends Error {
  data = null;

  constructor(message, data) {
    super(message); // 'Error' breaks prototype chain here
    this.data = data;
    this.name = 'ResponseValidationError';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}
