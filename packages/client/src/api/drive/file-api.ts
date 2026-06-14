import type { DoorayClient } from '../../lib/dooray-client';
import type { PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class DriveFileApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public copy(
    {
      body,
      path,
    }: {
      body: DriveFileCopyBody;
      path: { driveId: string; fileId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<EmptyRestResponse>(
      {
        body,
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}/copy`,
      },
      init,
    );
  }

  public createFolder(
    {
      body,
      path,
    }: {
      body: DriveFileCreateFolderBody;
      path: { driveId: string; folderId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<DriveFileCreateFolderResponse>(
      {
        body,
        path: url`drive/v1/drives/${path.driveId}/files/${path.folderId}/create-folder`,
      },
      init,
    );
  }

  public delete({ path }: { path: { driveId: string; fileId: string } }, init?: RestRequestInit) {
    return this.#client.post<EmptyRestResponse>(
      {
        body: { destinationFileId: 'trash' } satisfies DriveFileMoveBody,
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}/move`,
      },
      init,
    );
  }

  public download({ path }: { path: { driveId: string; fileId: string } }, init?: RestRequestInit) {
    return this.#client.requestRaw(
      {
        params: { media: 'raw' },
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}`,
      },
      { ...init, redirect: 'manual' },
    );
  }

  public getMeta({ path }: { path: { driveId: string; fileId: string } }, init?: RestRequestInit) {
    return this.#client.get<DriveFileMetaResponse>(
      {
        params: { media: 'meta' },
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}`,
      },
      init,
    );
  }

  public getMetaById({ path }: { path: { fileId: string } }, init?: RestRequestInit) {
    return this.#client.get<DriveFileMetaResponse>(
      {
        params: { media: 'meta' },
        path: url`drive/v1/files/${path.fileId}`,
      },
      init,
    );
  }

  public list(
    {
      params,
      path,
    }: {
      params?: DriveFileListParams;
      path: { driveId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.get<DriveFileListResponse>(
      {
        params,
        path: url`drive/v1/drives/${path.driveId}/files`,
      },
      init,
    );
  }

  public move(
    {
      body,
      path,
    }: {
      body: DriveFileMoveBody;
      path: { driveId: string; fileId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<EmptyRestResponse>(
      {
        body,
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}/move`,
      },
      init,
    );
  }

  public purge({ path }: { path: { driveId: string; fileId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}`,
      },
      init,
    );
  }

  public rename(
    {
      body,
      path,
    }: {
      body: DriveFileRenameBody;
      path: { driveId: string; fileId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        params: { media: 'meta' },
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}`,
      },
      init,
    );
  }

  public replace(
    {
      body,
      path,
    }: {
      body: FormData;
      path: { driveId: string; fileId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<DriveFileReplaceResponse>(
      {
        body,
        params: { media: 'raw' },
        path: url`drive/v1/drives/${path.driveId}/files/${path.fileId}`,
      },
      { ...init, redirect: 'manual' },
    );
  }

  public upload(
    {
      body,
      params,
      path,
    }: {
      body: FormData;
      params: DriveFileUploadParams;
      path: { driveId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<DriveFileUploadResponse>(
      {
        body,
        params,
        path: url`drive/v1/drives/${path.driveId}/files`,
      },
      { ...init, redirect: 'manual' },
    );
  }
}

export type DriveFileType = 'file' | 'folder';

export type DriveFileSubType = 'doc' | 'etc' | 'movie' | 'music' | 'photo' | 'root' | 'trash' | 'users' | 'zip';

export interface DriveFile {
  annotations?: { favorited: boolean; favoritedAt: null | string };
  createdAt: string;
  creator: { organizationMemberId: string };
  driveId: string;
  hasFolders: boolean | null;
  id: string;
  lastUpdater: { organizationMemberId: string };
  mimeType: string;
  name: string;
  parentFile?: { id: string; path: string };
  revision?: string;
  size: number;
  subType: DriveFileSubType;
  type: DriveFileType;
  updatedAt: string;
  version: number;
}

export type DriveFileListParams = {
  parentId?: string;
  subTypes?: string[];
  type?: DriveFileType;
} & PageParams;

export interface DriveFileListResponse extends RestResponse {
  result: DriveFile[];
  totalCount?: number;
}

export interface DriveFileMetaResponse extends RestResponse {
  result: DriveFile;
}

export interface DriveFileUploadParams {
  parentId: string;
}

export interface DriveFileUploadResponse extends RestResponse {
  result: DriveFile;
}

export interface DriveFileReplaceResponse extends RestResponse {
  result: {
    id: string;
    version: number;
  };
}

export interface DriveFileRenameBody {
  name: string;
}

export interface DriveFileCreateFolderBody {
  name: string;
}

export interface DriveFileCreateFolderResponse extends RestResponse {
  result: {
    id: string;
  };
}

export interface DriveFileCopyBody {
  destinationDriveId: string;
  destinationFileId: string;
}

export interface DriveFileMoveBody {
  destinationFileId: string;
}
