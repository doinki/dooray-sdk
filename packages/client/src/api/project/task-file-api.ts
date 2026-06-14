import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectTaskFileApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public upload(
    {
      body,
      path,
    }: {
      body: FormData;
      path: { projectId: string; taskId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<TaskFileUploadResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/files`,
      },
      { ...init, redirect: 'manual' },
    );
  }

  public delete({ path }: { path: { fileId: string; projectId: string; taskId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/files/${path.fileId}`,
      },
      init,
    );
  }

  public download({ path }: { path: { fileId: string; projectId: string; taskId: string } }, init?: RestRequestInit) {
    return this.#client.requestRaw(
      {
        params: { media: 'raw' },
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/files/${path.fileId}`,
      },
      { ...init, redirect: 'manual' },
    );
  }

  public getMeta({ path }: { path: { fileId: string; projectId: string; taskId: string } }, init?: RestRequestInit) {
    return this.#client.get<TaskFileMetaResponse>(
      {
        params: { media: 'meta' },
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/files/${path.fileId}`,
      },
      init,
    );
  }

  public list({ path }: { path: { projectId: string; taskId: string } }, init?: RestRequestInit) {
    return this.#client.get<TaskFileListResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/posts/${path.taskId}/files`,
      },
      init,
    );
  }
}

export interface TaskFile {
  createdAt: string;
  creator:
    | { emailUser: { emailAddress: string; name: string }; type: 'emailUser' }
    | { member: { organizationMemberId: number | string }; type: 'member' };
  id: string;
  mimeType: string;
  name: string;
  size: number | string;
}

export interface TaskFileListResponse extends CountedRestResponse {
  result: TaskFile[];
}

export interface TaskFileMetaResponse extends RestResponse {
  result: TaskFile;
}

export interface TaskFileUploadResponse extends RestResponse {
  result: { id: string };
}
