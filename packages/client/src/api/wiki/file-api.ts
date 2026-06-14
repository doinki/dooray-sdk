import type { DoorayClient } from '../../lib/dooray-client';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class WikiFileApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public deletePageFile(
    { path }: { path: { fileId: string; pageId: string; wikiId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/files/${path.fileId}`,
      },
      init,
    );
  }

  public downloadAttachFile({ path }: { path: { attachFileId: string; wikiId: string } }, init?: RestRequestInit) {
    return this.#client.requestRaw(
      {
        path: url`wiki/v1/wikis/${path.wikiId}/attachFiles/${path.attachFileId}`,
      },
      { ...init, redirect: 'manual' },
    );
  }

  public downloadPageFile(
    { path }: { path: { fileId: string; pageId: string; wikiId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.requestRaw(
      {
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/files/${path.fileId}`,
      },
      { ...init, redirect: 'manual' },
    );
  }

  public upload({ body, path }: { body: FormData; path: { wikiId: string } }, init?: RestRequestInit) {
    return this.#client.post<WikiFileUploadResponse>(
      { body, path: url`wiki/v1/wikis/${path.wikiId}/files` },
      { ...init, redirect: 'manual' },
    );
  }

  public uploadPageFile(
    { body, path }: { body: FormData; path: { pageId: string; wikiId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<WikiFileUploadResponse>(
      {
        body,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/files`,
      },
      { ...init, redirect: 'manual' },
    );
  }
}

export type WikiFileType = 'general' | 'inline_image';

export interface WikiFile {
  attachFileId: string;
  createdAt: string;
  extension: string;
  id: string;
  mimeType: string;
  name: string;
  pageFileId?: string;
  size: number;
  type: WikiFileType;
}

export interface WikiFileUploadResponse extends RestResponse {
  result: WikiFile;
}
