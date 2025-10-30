export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype); // fix instanceof
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class InvalidPasswordError extends AppError {
  constructor(message: string = 'Invalid Password') {
    super(message, 401);
  }
}

export class BadRequestFoundError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class InvalidOrExpiredToken extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class UnAuthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class AccessForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}
