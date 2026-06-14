import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectMemberGroupApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public get({ path }: { path: { memberGroupId: string; projectId: string } }, init?: RestRequestInit) {
    return this.#client.get<ProjectMemberGroupDetailResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/member-groups/${path.memberGroupId}`,
      },
      init,
    );
  }

  public async list(
    {
      params,
      path,
    }: {
      params?: ProjectMemberGroupListParams;
      path: { projectId: string };
    },
    init?: RestRequestInit,
  ) {
    const response = await this.#client.getPaginated<ProjectMemberGroupListResponse>(
      {
        params,
        path: url`project/v1/projects/${path.projectId}/member-groups`,
      },
      init,
    );

    return { ...response, result: response.result ?? [] };
  }
}

export interface ProjectMemberGroup {
  code: string;
  createdAt: string;
  id: string;
  project: { code: string; id: string; projectCategoryId: null | string };
  updatedAt: string;
}

export interface ProjectMemberGroupDetail {
  code: string;
  createdAt: string;
  id: string;
  members: Array<{ id: string; name: string }>;
  project: { code: string; id: string; projectCategoryId: null | string };
  updatedAt: string;
}

export type ProjectMemberGroupListParams = PageParams;

export interface ProjectMemberGroupListResponse extends CountedRestResponse {
  result: ProjectMemberGroup[];
}

export interface ProjectMemberGroupDetailResponse extends RestResponse {
  result: ProjectMemberGroupDetail;
}
