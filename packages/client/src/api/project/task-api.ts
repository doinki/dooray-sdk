import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';
import type { WorkflowClass } from './workflow-api';

export class ProjectTaskApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body, path }: { body: TaskCreateBody; path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.post<TaskCreateResponse>(
      { body, path: url`project/v1/projects/${path.projectId}/posts` },
      init,
    );
  }

  public createDraft({ body }: { body: TaskDraftCreateBody }, init?: RestRequestInit) {
    return this.#client.post<TaskDraftCreateResponse>({ body, path: 'project/v1/post-drafts' }, init);
  }

  public uploadDraftFile(
    {
      body,
      path,
    }: {
      body: FormData;
      path: { draftId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<TaskDraftFileUploadResponse>(
      {
        body,
        path: url`project/v1/post-drafts/${path.draftId}/files`,
      },
      { ...init, redirect: 'manual' },
    );
  }

  public get({ path }: { path: { projectId: string; taskId: string } }, init?: RestRequestInit) {
    return this.#client.get<TaskDetailResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}`,
      },
      init,
    );
  }

  public getById({ path }: { path: { taskId: string } }, init?: RestRequestInit) {
    return this.#client.get<TaskDetailResponse>({ path: url`project/v1/posts/${path.taskId}` }, init);
  }

  public list(
    {
      params,
      path,
    }: {
      params?: TaskListParams;
      path: { projectId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.getPaginated<TaskListResponse>(
      {
        params,
        path: url`project/v1/projects/${path.projectId}/posts`,
      },
      init,
    );
  }

  public move(
    {
      body,
      path,
    }: {
      body: TaskMoveBody;
      path: { projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<TaskMoveResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/move`,
      },
      init,
    );
  }

  public setAssigneeWorkflow(
    {
      body,
      path,
    }: {
      body: TaskSetWorkflowBody;
      path: { organizationMemberId: string; projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/to/${path.organizationMemberId}`,
      },
      init,
    );
  }

  public setDone({ path }: { path: { projectId: string; taskId: string } }, init?: RestRequestInit) {
    return this.#client.post<EmptyRestResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/set-done`,
      },
      init,
    );
  }

  public setParent(
    {
      body,
      path,
    }: {
      body: TaskSetParentBody;
      path: { projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<TaskSetParentResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/set-parent-post`,
      },
      init,
    );
  }

  public setWorkflow(
    {
      body,
      path,
    }: {
      body: TaskSetWorkflowBody;
      path: { projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/set-workflow`,
      },
      init,
    );
  }

  public update(
    {
      body,
      path,
    }: {
      body: TaskUpdateBody;
      path: { projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}`,
      },
      init,
    );
  }
}

export type TaskPriority = 'high' | 'highest' | 'low' | 'lowest' | 'none' | 'normal';

export interface TaskBody {
  content: string;
  mimeType: 'text/html' | 'text/x-markdown';
}

export type TaskWorkflowClass = WorkflowClass;

export type TaskUserInput =
  | { emailUser: { emailAddress: string; name?: string }; type: 'emailUser' }
  | { member: { organizationMemberId: string }; type: 'member' };

export interface TaskUsersInput {
  cc?: TaskUserInput[];
  to: TaskUserInput[];
}

export interface TaskSummary {
  closed: boolean;
  createdAt: string;
  dueDate?: null | string;
  dueDateFlag?: boolean;
  endedAt?: string;
  fileIdList: string[];
  id: string;
  milestone: { closedAt: null | string; id: string; name: string } | null;
  number: number;
  parent?: { id: string; number: number; subject: string } | null;
  priority: TaskPriority;
  project: { code: string; id: string; projectCategoryId: null | string };
  subject: string;
  tags: Array<{ id: string }>;
  taskNumber: string;
  updatedAt: string;
  users: {
    cc: Array<
      | {
          emailUser: { emailAddress: string; name: string };
          type: 'emailUser';
          workflow?: { id: string; name: string };
        }
      | {
          group: {
            code: string;
            members: Array<{ name: string; organizationMemberId: string; workflowId: string }>;
            projectMemberGroupId: string;
          };
          type: 'group';
          workflow?: { id: string; name: string };
        }
      | {
          member: { name: string; organizationMemberId: string };
          type: 'member';
          workflow?: { id: string; name: string };
        }
    >;
    from:
      | { emailUser: { emailAddress: string; name: string }; type: 'emailUser' }
      | { member: { name: string; organizationMemberId: string }; type: 'member' };
    to: Array<
      | {
          emailUser: { emailAddress: string; name: string };
          type: 'emailUser';
          workflow?: { id: string; name: string };
        }
      | {
          group: {
            code: string;
            members: Array<{ name: string; organizationMemberId: string; workflowId: string }>;
            projectMemberGroupId: string;
          };
          type: 'group';
          workflow?: { id: string; name: string };
        }
      | {
          member: { name: string; organizationMemberId: string };
          type: 'member';
          workflow?: { id: string; name: string };
        }
    >;
  };
  workflow: { id: string; name: string };
  workflowClass: TaskWorkflowClass;
}

export interface Task {
  body: { content: string; mimeType: 'text/html' | 'text/x-markdown' };
  closed: boolean;
  createdAt: string;
  dueDate?: null | string;
  dueDateFlag?: boolean;
  endedAt?: string;
  fileIdList?: string[];
  files?: Array<{ id: string; name: string; size: number | string }>;
  id: string;
  milestone: { closedAt: null | string; id: string; name: string } | null;
  number: number;
  parent?: { id: string; number: number; subject: string } | null;
  priority: TaskPriority;
  project: { code: string; id: string; projectCategoryId: null | string };
  subject: string;
  tags: Array<{ id: string }>;
  taskNumber: string;
  updatedAt: string;
  users: {
    cc: Array<
      | {
          emailUser: { emailAddress: string; name: string };
          type: 'emailUser';
          workflow?: { id: string; name: string };
        }
      | {
          group: {
            code: string;
            members: Array<{ name: string; organizationMemberId: string; workflowId: string }>;
            projectMemberGroupId: string;
          };
          type: 'group';
          workflow?: { id: string; name: string };
        }
      | {
          member: { name: string; organizationMemberId: string };
          type: 'member';
          workflow?: { id: string; name: string };
        }
    >;
    from:
      | { emailUser: { emailAddress: string; name: string }; type: 'emailUser' }
      | { member: { name: string; organizationMemberId: string }; type: 'member' };
    to: Array<
      | {
          emailUser: { emailAddress: string; name: string };
          type: 'emailUser';
          workflow?: { id: string; name: string };
        }
      | {
          group: {
            code: string;
            members: Array<{ name: string; organizationMemberId: string; workflowId: string }>;
            projectMemberGroupId: string;
          };
          type: 'group';
          workflow?: { id: string; name: string };
        }
      | {
          member: { name: string; organizationMemberId: string };
          type: 'member';
          workflow?: { id: string; name: string };
        }
    >;
  };
  workflow: { id: string; name: string };
  workflowClass: TaskWorkflowClass;
}

export type TaskListParams = {
  ccMemberIds?: string[];
  createdAt?: string;
  dueAt?: string;
  fromEmailAddress?: string;
  fromMemberIds?: string[];
  milestoneIds?: string[];
  order?: string;
  parentPostId?: string;
  postNumber?: number;
  postWorkflowClasses?: TaskWorkflowClass[];
  postWorkflowIds?: string[];
  subjects?: string[];
  tagIds?: string[];
  toMemberIds?: string[];
  toMemberSize?: 0 | 1;
  updatedAt?: string;
} & PageParams;

export interface TaskListResponse extends CountedRestResponse {
  result: TaskSummary[];
}

export interface TaskDetailResponse extends RestResponse {
  result: Task;
}

export interface TaskCreateBody {
  body: TaskBody;
  dueDate?: null | string;
  dueDateFlag?: boolean;
  milestoneId?: string;
  parentPostId?: string;
  priority?: TaskPriority;
  subject: string;
  tagIds?: string[];
  users: TaskUsersInput;
}

export interface TaskCreateResponse extends RestResponse {
  result: { id: string; milestone: null };
}

export interface TaskUpdateBody {
  body?: TaskBody;
  dueDate?: null | string;
  dueDateFlag?: boolean;
  milestoneId?: string;
  priority?: TaskPriority;
  subject?: string;
  tagIds?: string[];
  users?: TaskUsersInput;
  version?: null | number;
}

export interface TaskSetWorkflowBody {
  workflowId: string;
}

export interface TaskSetParentBody {
  parentPostId: string;
}

export interface TaskMoveResponse extends RestResponse {
  result: {
    post: { id: string };
    project: { id: string };
  };
}

export type TaskSetParentResponse = TaskMoveResponse;

export interface TaskMoveBody {
  includeSubPosts?: boolean;
  targetProjectId?: string;
}

export interface TaskDraftCreateBody {
  body: TaskBody;
  dueDate?: null | string;
  dueDateFlag?: boolean;
  milestoneId?: string;
  priority?: TaskPriority;
  projectId: string;
  subject: string;
  tagIds?: string[];
  users: TaskUsersInput;
}

export interface TaskDraftCreateResponse extends RestResponse {
  result: {
    id: string;
    url: string;
  };
}

export interface TaskDraftFileUploadResponse extends RestResponse {
  result: {
    id: string;
  };
}
