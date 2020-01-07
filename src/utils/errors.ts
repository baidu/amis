import {Payload} from '../types';

export class ServerError extends Error {
  type = 'ServerError';
  response: Payload;

  constructor(msg: string, response: Payload) {
    super(msg);
    this.response = response;
  }
}
