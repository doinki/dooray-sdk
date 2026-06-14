import type { DoorayClient } from '../../lib/dooray-client';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';

export class ProjectCategoryApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public list(_?: unknown, init?: RestRequestInit) {
    return this.#client.get<ProjectCategoryListResponse>({ path: 'project/v1/project-categories' }, init);
  }
}

export interface ProjectCategory {
  id: string;
  name: string;
  order: number;
  parentProjectCategoryId: null | string;
}

export interface ProjectCategoryListResponse extends RestResponse {
  result: ProjectCategory[];
}
