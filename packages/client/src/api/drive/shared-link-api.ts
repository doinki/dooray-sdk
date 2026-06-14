import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class DriveSharedLinkApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create(
    {
      body,
      path,
    }: {
      body: DriveSharedLinkCreateBody;
      path: { driveId: string; fileId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<DriveSharedLinkCreateResponse>(
      {
        body,
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}/shared-links`,
      },
      init,
    );
  }

  public delete({ path }: { path: { driveId: string; fileId: string; linkId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}/shared-links/${path.linkId}`,
      },
      init,
    );
  }

  public get({ path }: { path: { driveId: string; fileId: string; linkId: string } }, init?: RestRequestInit) {
    return this.#client.get<DriveSharedLinkDetailResponse>(
      {
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}/shared-links/${path.linkId}`,
      },
      init,
    );
  }

  public list(
    {
      params,
      path,
    }: {
      params?: DriveSharedLinkListParams;
      path: { driveId: string; fileId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.get<DriveSharedLinkListResponse>(
      {
        params,
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}/shared-links`,
      },
      init,
    );
  }

  public update(
    {
      body,
      path,
    }: {
      body: DriveSharedLinkUpdateBody;
      path: { driveId: string; fileId: string; linkId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}/shared-links/${path.linkId}`,
      },
      init,
    );
  }
}

export type DriveSharedLinkScope = 'member' | 'memberAndGuest' | 'memberAndGuestAndExternal';

export interface DriveSharedLinkSummary {
  id: string;
  scope: DriveSharedLinkScope;
  sharedLink: string;
}

export interface DriveSharedLink {
  createdAt: string;
  creator: { organizationMemberId: string };
  expiredAt: string;
  id: string;
  scope: DriveSharedLinkScope;
  sharedLink: string;
}

export interface DriveSharedLinkCreateBody {
  expiredAt: string;
  scope: DriveSharedLinkScope;
}

export interface DriveSharedLinkCreateResponse extends RestResponse {
  result: {
    id: string;
  };
}

export interface DriveSharedLinkListParams {
  valid?: boolean;
}

export interface DriveSharedLinkListResponse extends CountedRestResponse {
  result: DriveSharedLinkSummary[];
}

export interface DriveSharedLinkDetailResponse extends RestResponse {
  result: DriveSharedLink;
}

export interface DriveSharedLinkUpdateBody {
  expiredAt: string;
  scope: DriveSharedLinkScope;
}
