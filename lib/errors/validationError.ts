import Status from 'http-status';

export class ValidationError extends Error {
  status: number = Status.BAD_REQUEST;
  constructor(message?: string){
    super(message);
    this.name = 'ValidationError';
  }
}