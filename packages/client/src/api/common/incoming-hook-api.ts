import type { DoorayClient } from '../../lib/dooray-client';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class IncomingHookApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body }: { body: IncomingHookCreateBody }, init?: RestRequestInit) {
    return this.#client.post<IncomingHookCreateResponse>({ body, path: 'common/v1/incoming-hooks' }, init);
  }

  public delete({ path }: { path: { incomingHookId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>({ path: url`common/v1/incoming-hooks/${path.incomingHookId}` }, init);
  }

  public get({ path }: { path: { incomingHookId: string } }, init?: RestRequestInit) {
    return this.#client.get<IncomingHookDetailResponse>(
      { path: url`common/v1/incoming-hooks/${path.incomingHookId}` },
      init,
    );
  }
}

export type IncomingHookServiceType =
  | 'bitbucket'
  | 'github'
  | 'gitlab'
  | 'ifttt'
  | 'incoming'
  | 'jenkins'
  | 'jira'
  | 'newrelic'
  | 'trello';

export interface IncomingHookCreateBody {
  name: string;
  projectIds: string[];
  serviceType: IncomingHookServiceType;
}

export interface IncomingHookCreateResponse extends RestResponse {
  result: {
    id: string;
    url: string;
  };
}

export interface IncomingHookDetailResponse extends RestResponse {
  result: IncomingHook;
}

export interface IncomingHook {
  id: string;
  name: string;
  projects: Array<{ id: string }>;
  serviceType: IncomingHookServiceType;
  url: string;
}
