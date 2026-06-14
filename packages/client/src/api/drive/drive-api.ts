import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class DriveApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public get({ path }: { path: { driveId: string } }, init?: RestRequestInit) {
    return this.#client.get<DriveDetailResponse>({ path: url`drive/v1/drives/${path.driveId}` }, init);
  }

  public list({ params }: { params?: DriveListParams } = {}, init?: RestRequestInit) {
    return this.#client.get<DriveListResponse>(
      {
        params,
        path: 'drive/v1/drives',
      },
      init,
    );
  }

  public listChanges(
    {
      params,
      path,
    }: {
      params?: DriveChangeListParams;
      path: { driveId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.get<DriveChangeListResponse>(
      { params, path: url`drive/v2/drives/${path.driveId}/changes` },
      init,
    );
  }
}

export type DriveType = 'private' | 'project';

export type DriveState = 'active' | 'archived' | 'deleted';

export type DriveScope = 'private' | 'public';

export type DriveMemberRole = 'owner' | 'project_admin' | 'project_member';

export interface Drive {
  id: string;
  name: string;
  project: { id: string; projectCategoryId: null | string };
  type: DriveType;
}

export interface DriveDetail {
  id: string;
  members: Array<{ organizationMemberId: string; role: DriveMemberRole }>;
  name: string;
  project: { id: string; projectCategoryId: null | string };
  type: DriveType;
}

export interface DriveListParams {
  projectId?: string;
  scope?: DriveScope;
  state?: DriveState | DriveState[];
  type?: DriveType;
}

export interface DriveListResponse extends CountedRestResponse {
  result: Drive[];
}

export interface DriveDetailResponse extends RestResponse {
  result: DriveDetail;
}

export type DriveChangeType = 'deleted' | 'updated';

export interface DriveChange {
  changeType: DriveChangeType;
  file: {
    hash: null | string;
    id: string;
    name: null | string;
    path: null | string;
    revision: string;
    size: null | number;
    type: 'file' | 'folder';
    version: null | number;
  };
  revision: string;
}

export interface DriveChangeListParams {
  fileId?: string;
  latestRevision?: number | string;
  size?: number;
}

export interface DriveChangeListResponse extends RestResponse {
  result: DriveChange[];
}
