import { isObjectLike } from './is-object-like';

export interface RestResponseHeader {
  isSuccessful: boolean;
  resultCode: number;
  resultMessage: string;
}

export interface RestResponse {
  header: RestResponseHeader;
}

export interface EmptyRestResponse extends RestResponse {
  result: null;
}

export function isRestResponse(data: unknown): data is RestResponse {
  return (
    isObjectLike(data) &&
    isObjectLike(data.header) &&
    typeof data.header.isSuccessful === 'boolean' &&
    typeof data.header.resultCode === 'number' &&
    typeof data.header.resultMessage === 'string'
  );
}
