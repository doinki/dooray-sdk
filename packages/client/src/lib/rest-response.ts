import { isObjectLike } from './is-object-like';

// Error responses may carry only resultMessage (e.g. `{"header":{"resultMessage":"..."}}`);
// only success responses are guaranteed a full header.
export interface RestResponseHeader {
  isSuccessful?: boolean;
  resultCode?: number;
  resultMessage: string;
}

export interface RestResponse {
  header: RestResponseHeader;
}

export interface EmptyRestResponse extends RestResponse {
  result: null;
}

export function isRestResponse(data: unknown): data is RestResponse {
  return isObjectLike(data) && isObjectLike(data.header) && typeof data.header.resultMessage === 'string';
}
