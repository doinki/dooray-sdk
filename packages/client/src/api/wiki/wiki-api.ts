import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';

export class WikiApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public list({ params }: { params?: WikiListParams } = {}, init?: RestRequestInit) {
    return this.#client.getPaginated<WikiListResponse>(
      {
        params,
        path: 'wiki/v1/wikis',
      },
      init,
    );
  }
}

export interface Wiki {
  home: { pageId: string };
  id: string;
  name: string;
  project: { id: string; projectCategoryId: null | string };
  scope: 'private' | 'public';
  type: 'private' | 'public';
}

export type WikiListParams = PageParams;

export interface WikiListResponse extends CountedRestResponse {
  result: Wiki[];
}
