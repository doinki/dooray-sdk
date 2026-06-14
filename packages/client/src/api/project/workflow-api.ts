import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectWorkflowApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body, path }: { body: WorkflowCreateBody; path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.post<EmptyRestResponse>(
      { body, path: url`project/v1/projects/${path.projectId}/workflows` },
      init,
    );
  }

  public delete(
    {
      body,
      path,
    }: {
      body: WorkflowDeleteBody;
      path: { projectId: string; workflowId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/workflows/${path.workflowId}/delete`,
      },
      init,
    );
  }

  public list({ path }: { path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.get<WorkflowListResponse>({ path: url`project/v1/projects/${path.projectId}/workflows` }, init);
  }

  public update(
    {
      body,
      path,
    }: {
      body: WorkflowUpdateBody;
      path: { projectId: string; workflowId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/workflows/${path.workflowId}`,
      },
      init,
    );
  }
}

export type WorkflowClass = 'backlog' | 'closed' | 'registered' | 'working';

export type WorkflowLocale = 'en_US' | 'ja_JP' | 'ko_KR' | 'zh_CN';

export interface WorkflowLocaleName {
  locale: WorkflowLocale;
  name: string;
}

export interface Workflow {
  class: WorkflowClass;
  id: string;
  name: string;
  names: Array<{ locale: WorkflowLocale; name: string }>;
  order: number;
}

export interface WorkflowListResponse extends CountedRestResponse {
  result: Workflow[];
}

export interface WorkflowCreateBody {
  class: WorkflowClass;
  name: string;
  names?: WorkflowLocaleName[];
  order?: number;
}

export interface WorkflowUpdateBody {
  class?: WorkflowClass;
  name?: string;
  names?: WorkflowLocaleName[];
  order?: number;
}

export interface WorkflowDeleteBody {
  toBeWorkflowId: string;
}
