import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectTaskCommentApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create(
    {
      body,
      path,
    }: {
      body: TaskCommentCreateBody;
      path: { projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<TaskCommentCreateResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/logs`,
      },
      init,
    );
  }

  public delete({ path }: { path: { commentId: string; projectId: string; taskId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/logs/${path.commentId}`,
      },
      init,
    );
  }

  public get({ path }: { path: { commentId: string; projectId: string; taskId: string } }, init?: RestRequestInit) {
    return this.#client.get<TaskCommentDetailResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/logs/${path.commentId}`,
      },
      init,
    );
  }

  public list(
    {
      params,
      path,
    }: {
      params?: TaskCommentListParams;
      path: { projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.getPaginated<TaskCommentListResponse>(
      {
        params,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/logs`,
      },
      init,
    );
  }

  public update(
    {
      body,
      path,
    }: {
      body: TaskCommentUpdateBody;
      path: { commentId: string; projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/logs/${path.commentId}`,
      },
      init,
    );
  }
}

export type TaskCommentType = 'comment' | 'event';

export type TaskCommentSubtype = 'from_email' | 'general' | 'sent_email';

export interface TaskComment {
  body: { content: string; mimeType: 'text/html' | 'text/x-markdown' };
  createdAt: string;
  creator:
    | { emailUser: { emailAddress: string; name: string }; type: 'emailUser' }
    | { member: { organizationMemberId: number | string }; type: 'member' };
  files?: Array<{ id: string; name: null | string; size: null | number | string }>;
  id: string;
  mailUsers?: {
    cc?: Array<{ emailAddress: string; name: string }>;
    from?: { emailAddress: string; name: string };
    to?: Array<{ emailAddress: string; name: string }>;
  };
  modifiedAt?: string;
  post: { id: string };
  subtype: TaskCommentSubtype;
  type: TaskCommentType;
}

export type TaskCommentListParams = {
  order?: string;
} & PageParams;

export interface TaskCommentListResponse extends CountedRestResponse {
  result: TaskComment[];
}

export interface TaskCommentDetailResponse extends RestResponse {
  result: TaskComment;
}

export interface TaskCommentBodyInput {
  content: string;
  mimeType?: 'text/html' | 'text/x-markdown';
}

export interface TaskCommentCreateBody {
  attachFileIds?: string[];
  body: TaskCommentBodyInput;
}

export interface TaskCommentCreateResponse extends RestResponse {
  result: { id: string };
}

export interface TaskCommentUpdateBody {
  attachFileIds?: string[];
  body: TaskCommentBodyInput;
}
