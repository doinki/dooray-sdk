import type { RestResponse, RestResponseHeader } from './rest-response';

const REST_RESPONSE_ERROR_NAME = 'RestResponseError' as const;

export const CONTRACT_VIOLATION_RESULT_CODE = -1;

type ContractViolationReason = 'missing-location' | 'redirect-limit-exceeded' | 'unexpected-shape';

const CONTRACT_VIOLATION_MESSAGES: Record<ContractViolationReason, string> = {
  'missing-location': 'Redirect response is missing the Location header',
  'redirect-limit-exceeded': 'Redirect limit exceeded',
  'unexpected-shape': 'Unexpected response shape',
};

export function makeContractViolationRestResponse(reason: ContractViolationReason, detail?: string): RestResponse {
  const message = CONTRACT_VIOLATION_MESSAGES[reason];

  return {
    header: {
      isSuccessful: false,
      resultCode: CONTRACT_VIOLATION_RESULT_CODE,
      resultMessage: [message, detail].filter(Boolean).join(': '),
    },
  };
}

export function makeHttpErrorRestResponse(response: Response): RestResponse {
  return {
    header: {
      isSuccessful: false,
      resultCode: -response.status,
      resultMessage: [response.status, response.statusText].filter(Boolean).join(' '),
    },
  };
}

export class RestResponseError<T extends RestResponse = RestResponse> extends Error {
  public name = REST_RESPONSE_ERROR_NAME;

  public readonly [Symbol.toStringTag] = REST_RESPONSE_ERROR_NAME;

  public readonly request: Request;

  public readonly response: Response;

  public readonly data: T;

  public constructor(request: Request, response: Response, data: T) {
    super(formatErrorMessage(request, data.header));

    this.request = request;
    this.response = response;
    this.data = data;
  }

  public toJSON(): Record<string, unknown> {
    return {
      data: this.data,
      message: this.message,
      name: this.name,
      request: {
        method: this.request.method,
        url: this.request.url,
      },
      response: {
        status: this.response.status,
        statusText: this.response.statusText,
      },
    };
  }
}

export function isRestResponseError<T extends RestResponse = RestResponse>(
  value: unknown,
  code?: number | readonly number[],
): value is RestResponseError<T> {
  if (!isRestResponseErrorInstance<T>(value)) return false;
  if (code === undefined) return true;

  const resultCode = value.data.header.resultCode;

  return Array.isArray(code) ? code.includes(resultCode) : code === resultCode;
}

function isRestResponseErrorInstance<T extends RestResponse>(value: unknown): value is RestResponseError<T> {
  return (
    value instanceof RestResponseError ||
    Object.prototype.toString.call(value) === `[object ${REST_RESPONSE_ERROR_NAME}]`
  );
}

function formatErrorMessage(request: Request, { resultCode, resultMessage }: RestResponseHeader): string {
  return `[${resultCode}] ${resultMessage} (${request.method} ${request.url})`;
}
