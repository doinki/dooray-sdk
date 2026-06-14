import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectMemberApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public add({ body, path }: { body: ProjectMemberAddBody; path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.post<ProjectMemberAddResponse>(
      { body, path: url`project/v1/projects/${path.projectId}/members` },
      init,
    );
  }

  public get({ path }: { path: { memberId: string; projectId: string } }, init?: RestRequestInit) {
    return this.#client.get<ProjectMemberDetailResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/members/${path.memberId}`,
      },
      init,
    );
  }

  public list(
    {
      params,
      path,
    }: {
      params?: ProjectMemberListParams;
      path: { projectId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.getPaginated<ProjectMemberListResponse>(
      {
        params,
        path: url`project/v1/projects/${path.projectId}/members`,
      },
      init,
    );
  }
}

export type ProjectMemberRole = 'admin' | 'leaver' | 'member' | 'postuser';

export type ProjectMemberAssignableRole = 'admin' | 'member';

export interface ProjectMember {
  organizationMemberId: string;
  role: ProjectMemberRole;
}

export type ProjectMemberListParams = {
  roles?: ProjectMemberAssignableRole[];
} & PageParams;

export interface ProjectMemberListResponse extends CountedRestResponse {
  result: ProjectMember[];
}

export interface ProjectMemberDetailResponse extends RestResponse {
  result: ProjectMember;
}

export interface ProjectMemberAddBody {
  organizationMemberId: string;
  role: ProjectMemberAssignableRole;
}

export interface ProjectMemberAddResponse extends RestResponse {
  result: { organizationMemberId: null; role: ProjectMemberAssignableRole };
}
