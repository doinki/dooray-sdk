import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class WikiCommentApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create(
    {
      body,
      path,
    }: {
      body: WikiCommentCreateBody;
      path: { pageId: string; wikiId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.post<WikiCommentCreateResponse>(
      {
        body,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/comments`,
      },
      init,
    );
  }

  public delete({ path }: { path: { commentId: string; pageId: string; wikiId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/comments/${path.commentId}`,
      },
      init,
    );
  }

  public get({ path }: { path: { commentId: string; pageId: string; wikiId: string } }, init?: RestRequestInit) {
    return this.#client.get<WikiCommentDetailResponse>(
      {
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/comments/${path.commentId}`,
      },
      init,
    );
  }

  public list(
    {
      params,
      path,
    }: {
      params?: WikiCommentListParams;
      path: { pageId: string; wikiId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.getPaginated<WikiCommentListResponse>(
      {
        params,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/comments`,
      },
      init,
    );
  }

  public update(
    {
      body,
      path,
    }: {
      body: WikiCommentUpdateBody;
      path: { commentId: string; pageId: string; wikiId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/comments/${path.commentId}`,
      },
      init,
    );
  }
}

export interface WikiComment {
  body: { content: string; mimeType: 'text/x-markdown' };
  createdAt: string;
  creator: { member: { name: string; organizationMemberId: string }; type: 'member' };
  id: string;
  modifiedAt: string;
  page: { id: string };
}

export interface WikiCommentBodyInput {
  content: string;
}

export interface WikiCommentCreateBody {
  body: WikiCommentBodyInput;
}

export interface WikiCommentCreateResponse extends RestResponse {
  result: {
    id: string;
  };
}

export type WikiCommentListParams = PageParams;

export interface WikiCommentListResponse extends CountedRestResponse {
  result: WikiComment[];
}

export interface WikiCommentDetailResponse extends RestResponse {
  result: WikiComment;
}

export interface WikiCommentUpdateBody {
  body: WikiCommentBodyInput;
}
