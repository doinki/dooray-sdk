import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public checkCreatable({ body }: { body: ProjectCheckCreatableBody }, init?: RestRequestInit) {
    return this.#client.post<EmptyRestResponse>({ body, path: 'project/v1/projects/is-creatable' }, init);
  }

  public create({ body }: { body: ProjectCreateBody }, init?: RestRequestInit) {
    return this.#client.post<ProjectCreateResponse>({ body, path: 'project/v1/projects' }, init);
  }

  public get({ path }: { path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.get<ProjectDetailResponse>({ path: url`project/v1/projects/${path.projectId}` }, init);
  }

  public list({ params }: { params?: ProjectListParams } = {}, init?: RestRequestInit) {
    return this.#client.getPaginated<ProjectListResponse>(
      {
        params,
        path: 'project/v1/projects',
      },
      init,
    );
  }
}

export type ProjectScope = 'private' | 'public';

export type ProjectType = 'private' | 'public';

export type ProjectState = 'active' | 'archived' | 'deleted';

export interface Project {
  code: string;
  description: string;
  drive?: { id: string };
  id: string;
  organization: { id: string };
  projectCategoryId: null | string;
  scope: ProjectScope;
  state: ProjectState;
  type: ProjectType;
  wiki?: { id: string };
}

export type ProjectListParams = {
  member?: string;
  scope?: ProjectScope;
  state?: ProjectState;
  type?: ProjectType;
} & PageParams;

export interface ProjectListResponse extends CountedRestResponse {
  result: Project[];
}

export interface ProjectDetailResponse extends RestResponse {
  result: Project;
}

export interface ProjectCreateBody {
  code: string;
  description?: string;
  projectCategoryId?: string;
  scope: ProjectScope;
}

export interface ProjectCreateResponse extends RestResponse {
  result: { id: string };
}

export interface ProjectCheckCreatableBody {
  code: string;
}
