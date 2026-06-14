export type RestRequestParamPrimitive = boolean | null | number | string | undefined;

export type RestRequestParams = Record<string, RestRequestParamPrimitive | RestRequestParamPrimitive[]>;

export interface RestRequestArgs {
  body?: object | RequestInit['body'];
  params?: object;
  path: string;
}

export type RestRequestInit = Omit<RequestInit, 'body' | 'method'>;

export function appendSearchParams(searchParams: URLSearchParams, params: object): void {
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (Array.isArray(value)) searchParams.set(key, value.filter((item) => item != null).join(','));
    else searchParams.set(key, String(value));
  }
}
