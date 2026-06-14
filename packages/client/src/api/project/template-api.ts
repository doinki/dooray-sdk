import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';
import type { TaskBody, TaskPriority, TaskUsersInput } from './task-api';

export class ProjectTemplateApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create(
    { body, path }: { body: ProjectTemplateCreateBody; path: { projectId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<ProjectTemplateCreateResponse>(
      { body, path: url`project/v1/projects/${path.projectId}/templates` },
      init,
    );
  }

  public delete({ path }: { path: { projectId: string; templateId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/templates/${path.templateId}`,
      },
      init,
    );
  }

  public get(
    {
      params,
      path,
    }: {
      params?: ProjectTemplateDetailParams;
      path: { projectId: string; templateId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.get<ProjectTemplateDetailResponse>(
      {
        params,
        path: url`project/v1/projects/${path.projectId}/templates/${path.templateId}`,
      },
      init,
    );
  }

  public list(
    {
      params,
      path,
    }: {
      params?: ProjectTemplateListParams;
      path: { projectId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.getPaginated<ProjectTemplateListResponse>(
      {
        params,
        path: url`project/v1/projects/${path.projectId}/templates`,
      },
      init,
    );
  }

  public update(
    {
      body,
      path,
    }: {
      body: ProjectTemplateUpdateBody;
      path: { projectId: string; templateId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/templates/${path.templateId}`,
      },
      init,
    );
  }
}

export interface ProjectTemplateSummary {
  dueDate?: string;
  dueDateFlag: boolean;
  id: string;
  isDefault: boolean;
  milestone?: { closedAt: null | string; id: string; name: string };
  priority: TaskPriority;
  project: { code: string; id: string; projectCategoryId: null | string };
  subject: string;
  tags: Array<{ id: string }>;
  templateName: string;
  users: {
    cc: Array<
      | { emailUser: { emailAddress: string; name: null | string }; type: 'emailUser' }
      | {
          group: {
            members: [{ name: string; organizationMemberId: string }];
            projectMemberGroupId: string;
          };
          type: 'group';
        }
      | { member: { name: string; organizationMemberId: string }; type: 'member' }
    >;
    to: Array<
      | { emailUser: { emailAddress: string; name: null | string }; type: 'emailUser' }
      | {
          group: {
            members: [{ name: string; organizationMemberId: string }];
            projectMemberGroupId: string;
          };
          type: 'group';
        }
      | { member: { name: string; organizationMemberId: string }; type: 'member' }
    >;
  };
}

export interface ProjectTemplate {
  body: { content: string; mimeType: 'text/html' | 'text/x-markdown' | null };
  dueDate?: string;
  dueDateFlag: boolean;
  guide: { content: string; mimeType: 'text/html' | 'text/x-markdown' | null };
  id: string;
  isDefault: boolean;
  milestone?: { closedAt: null | string; id: string; name: string };
  priority: TaskPriority;
  project: { code: string; id: string; projectCategoryId: null | string };
  subject: string;
  tags: Array<{ id: string }>;
  templateName: string;
  users: {
    cc: Array<
      | { emailUser: { emailAddress: string; name: null | string }; type: 'emailUser' }
      | {
          group: {
            members: [{ name: string; organizationMemberId: string }];
            projectMemberGroupId: string;
          };
          type: 'group';
        }
      | { member: { name: string; organizationMemberId: string }; type: 'member' }
    >;
    to: Array<
      | { emailUser: { emailAddress: string; name: null | string }; type: 'emailUser' }
      | {
          group: {
            members: [{ name: string; organizationMemberId: string }];
            projectMemberGroupId: string;
          };
          type: 'group';
        }
      | { member: { name: string; organizationMemberId: string }; type: 'member' }
    >;
  };
}

export type ProjectTemplateListParams = PageParams;

export interface ProjectTemplateDetailParams {
  interpolation?: boolean;
}

export interface ProjectTemplateListResponse extends CountedRestResponse {
  result: ProjectTemplateSummary[];
}

export interface ProjectTemplateDetailResponse extends RestResponse {
  result: ProjectTemplate;
}

export interface ProjectTemplateCreateBody {
  body?: TaskBody;
  dueDate?: null | string;
  dueDateFlag?: boolean;
  guide?: TaskBody;
  isDefault?: boolean;
  milestoneId?: string;
  priority?: TaskPriority;
  subject?: string;
  tagIds?: string[];
  templateName: string;
  users?: TaskUsersInput;
}

export interface ProjectTemplateCreateResponse extends RestResponse {
  result: { id: string };
}

export interface ProjectTemplateUpdateBody {
  body?: TaskBody;
  dueDate?: null | string;
  dueDateFlag?: boolean;
  guide?: TaskBody;
  isDefault?: boolean;
  milestoneId?: string;
  priority?: TaskPriority;
  subject?: string;
  tagIds?: string[];
  templateName: string;
  users?: TaskUsersInput;
}
