import Status from 'http-status';

export class NotFoundError extends Error {
  status: number = Status.NOT_FOUND;
  constructor(message?: string){
    super(message);
    this.name = 'NotFoundError';
  }
}