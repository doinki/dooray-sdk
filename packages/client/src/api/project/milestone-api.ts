import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectMilestoneApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body, path }: { body: MilestoneCreateBody; path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.post<MilestoneCreateResponse>(
      { body, path: url`project/v1/projects/${path.projectId}/milestones` },
      init,
    );
  }

  public delete({ path }: { path: { milestoneId: string; projectId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/milestones/${path.milestoneId}`,
      },
      init,
    );
  }

  public get({ path }: { path: { milestoneId: string; projectId: string } }, init?: RestRequestInit) {
    return this.#client.get<MilestoneDetailResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/milestones/${path.milestoneId}`,
      },
      init,
    );
  }

  public list({ params, path }: { params?: MilestoneListParams; path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.getPaginated<MilestoneListResponse>(
      {
        params,
        path: url`project/v1/projects/${path.projectId}/milestones`,
      },
      init,
    );
  }

  public update(
    {
      body,
      path,
    }: {
      body: MilestoneUpdateBody;
      path: { milestoneId: string; projectId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/milestones/${path.milestoneId}`,
      },
      init,
    );
  }
}

export type MilestoneStatus = 'closed' | 'open';

export interface Milestone {
  closedAt: null | string;
  createdAt: string;
  endedAt?: string;
  id: string;
  name: string;
  startedAt?: string;
  status: MilestoneStatus;
  updatedAt: string;
}

export type MilestoneListParams = {
  status?: MilestoneStatus;
} & PageParams;

export interface MilestoneListResponse extends CountedRestResponse {
  result: Milestone[];
}

export interface MilestoneDetailResponse extends RestResponse {
  result: Milestone;
}

export interface MilestoneCreateBody {
  endedAt?: null | string;
  name: string;
  startedAt?: null | string;
}

export interface MilestoneCreateResponse extends RestResponse {
  result: { id: string };
}

export interface MilestoneUpdateBody {
  endedAt?: string;
  name?: string;
  startedAt?: string;
  status?: MilestoneStatus;
}
