import type { DoorayClient } from '../../lib/dooray-client';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectHookApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body, path }: { body: ProjectHookCreateBody; path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.post<ProjectHookCreateResponse>(
      { body, path: url`project/v1/projects/${path.projectId}/hooks` },
      init,
    );
  }
}

export type ProjectHookEvent =
  | 'codeChanged'
  | 'memberChanged'
  | 'postBodyChanged'
  | 'postCommentCreated'
  | 'postCommentUpdated'
  | 'postCreated'
  | 'postDueDateChanged'
  | 'postMilestoneChanged'
  | 'postMoved'
  | 'postParentChanged'
  | 'postSubjectChanged'
  | 'postTagChanged'
  | 'postUserChanged'
  | 'postWorkflowChanged'
  | 'stateChanged';

export interface ProjectHookBodyOption {
  embedInlineImage?: boolean;
  include?: boolean;
}

export interface ProjectHookOption {
  body?: ProjectHookBodyOption;
}

export interface ProjectHookCreateBody {
  option?: ProjectHookOption;
  sendEvents: ProjectHookEvent[];
  type?: 'project' | 'task';
  url: string;
}

export interface ProjectHookCreateResponse extends RestResponse {
  result: {
    id: string;
  };
}
