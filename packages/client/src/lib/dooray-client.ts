// oxlint-disable no-await-in-loop

import { isPlainObject } from './is-plain-object';
import type { CountedRestResponse, PageParams, PaginatedResponse } from './pagination';
import { computeHasNext, DEFAULT_PAGE, DEFAULT_SIZE } from './pagination';
import type { RestRequestArgs, RestRequestInit } from './rest-request';
import { appendSearchParams } from './rest-request';
import type { RestResponse } from './rest-response';
import { isRestResponse } from './rest-response';
import { makeContractViolationRestResponse, makeHttpErrorRestResponse, RestResponseError } from './rest-response-error';

const AUTHORIZATION_HEADER = 'Authorization';
const CONTENT_TYPE_HEADER = 'Content-Type';
const LOCATION_HEADER = 'Location';
const JSON_MIME_TYPE = 'application/json';
const HTTP_STATUS_TEMPORARY_REDIRECT = 307;
const HTTP_STATUS_PERMANENT_REDIRECT = 308;
const MAX_MANUAL_REDIRECTS = 5;

export interface DoorayClientOptions {
  baseUrl: string;
  onError?: (error: RestResponseError) => Promise<void> | void;
  onRequest?: (request: Request) => Promise<void> | void;
  onResponse?: (request: Request, response: Response) => Promise<void> | void;
  token: string;
}

export class DoorayClient {
  readonly #authorization: string;
  readonly #baseUrl: URL;
  readonly #onError?: DoorayClientOptions['onError'];
  readonly #onRequest?: DoorayClientOptions['onRequest'];
  readonly #onResponse?: DoorayClientOptions['onResponse'];

  public constructor(options: DoorayClientOptions) {
    this.#authorization = `dooray-api ${options.token}`;
    this.#baseUrl = new URL(options.baseUrl.endsWith('/') ? options.baseUrl : `${options.baseUrl}/`);
    this.#onError = options.onError;
    this.#onRequest = options.onRequest;
    this.#onResponse = options.onResponse;
  }

  async #dispatch(request: Request): Promise<Response> {
    try {
      await this.#onRequest?.(request);
    } catch {}

    const response = await fetch(request);

    try {
      await this.#onResponse?.(request, response);
    } catch {}

    return response;
  }

  public async requestRaw(
    args: RestRequestArgs,
    init?: Omit<RequestInit, 'body'>,
  ): Promise<{ request: Request; response: Response }> {
    const { body, params, path } = args;
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
    const requestUrl = new URL(normalizedPath, this.#baseUrl);
    if (params) appendSearchParams(requestUrl.searchParams, params);

    const headers = new Headers(init?.headers);
    if (!headers.has(AUTHORIZATION_HEADER)) headers.set(AUTHORIZATION_HEADER, this.#authorization);
    const requestInit: RequestInit = { ...init, headers };

    if (isPlainObject(body) || Array.isArray(body)) {
      requestInit.body = JSON.stringify(body);
      if (!headers.has(CONTENT_TYPE_HEADER)) headers.set(CONTENT_TYPE_HEADER, JSON_MIME_TYPE);
    } else {
      requestInit.body = body;
    }

    let request = new Request(requestUrl, requestInit);
    let response = await this.#dispatch(request);

    if (requestInit.redirect === 'manual')
      ({ request, response } = await this.#followManualRedirects({ request, requestInit, response }));

    if (!response.ok) throw await this.#notifyAndCreateError(request, response, makeHttpErrorRestResponse(response));

    return { request, response };
  }

  async #request<T extends RestResponse>(
    args: RestRequestArgs,
    init?: Omit<RequestInit, 'body'>,
  ): Promise<{ data: T; request: Request; response: Response }> {
    const { request, response } = await this.requestRaw(args, init);

    const data = await response.json();

    if (!isRestResponse(data))
      throw await this.#notifyAndCreateError(request, response, makeContractViolationRestResponse('unexpected-shape'));

    if (!data.header.isSuccessful) throw await this.#notifyAndCreateError(request, response, data);

    return { data: data as T, request, response };
  }

  public get<T extends RestResponse>(args: RestRequestArgs, init?: RestRequestInit): Promise<T> {
    return this.#request<T>(args, init).then(({ data }) => data);
  }

  public delete<T extends RestResponse>(args: RestRequestArgs, init?: RestRequestInit): Promise<T> {
    return this.#request<T>(args, { ...init, method: 'DELETE' }).then(({ data }) => data);
  }

  public put<T extends RestResponse>(args: RestRequestArgs, init?: RestRequestInit): Promise<T> {
    return this.#request<T>(args, { ...init, method: 'PUT' }).then(({ data }) => data);
  }

  public post<T extends RestResponse>(args: RestRequestArgs, init?: RestRequestInit): Promise<T> {
    return this.#request<T>(args, { ...init, method: 'POST' }).then(({ data }) => data);
  }

  public async getPaginated<T extends CountedRestResponse>(
    args: { params?: PageParams } & Omit<RestRequestArgs, 'params'>,
    init?: Omit<RequestInit, 'body'>,
  ): Promise<PaginatedResponse<T>> {
    const { page = DEFAULT_PAGE, size = DEFAULT_SIZE, ...rest } = args.params ?? {};

    const { data } = await this.#request<T>({ ...args, params: { ...rest, page, size } }, init);

    const totalElements = Number(data.totalCount);

    return {
      ...data,
      paging: {
        hasNext: computeHasNext({ page, size, totalElements }),
        page,
        size,
        totalElements,
      },
    };
  }

  async #followManualRedirects({
    request,
    requestInit,
    response,
  }: {
    request: Request;
    requestInit: RequestInit;
    response: Response;
  }): Promise<{ request: Request; response: Response }> {
    let currentRequest = request;
    let currentResponse = response;

    for (let i = 0; i < MAX_MANUAL_REDIRECTS && isRedirectStatus(currentResponse.status); i += 1) {
      const location = currentResponse.headers.get(LOCATION_HEADER);
      if (!location) {
        throw await this.#notifyAndCreateError(
          currentRequest,
          currentResponse,
          makeContractViolationRestResponse('missing-location'),
        );
      }

      const nextUrl = new URL(location, currentRequest.url);

      currentRequest = new Request(nextUrl, requestInit);
      currentResponse = await this.#dispatch(currentRequest);
    }

    if (isRedirectStatus(currentResponse.status)) {
      throw await this.#notifyAndCreateError(
        currentRequest,
        currentResponse,
        makeContractViolationRestResponse('redirect-limit-exceeded', `limit: ${MAX_MANUAL_REDIRECTS}`),
      );
    }

    return { request: currentRequest, response: currentResponse };
  }

  async #notifyAndCreateError(request: Request, response: Response, data: RestResponse): Promise<RestResponseError> {
    const error = new RestResponseError(request, response, data);
    try {
      await this.#onError?.(error);
    } catch {}
    return error;
  }
}

function isRedirectStatus(status: number): boolean {
  return status === HTTP_STATUS_TEMPORARY_REDIRECT || status === HTTP_STATUS_PERMANENT_REDIRECT;
}
