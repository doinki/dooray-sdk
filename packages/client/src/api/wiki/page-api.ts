import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class WikiPageApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body, path }: { body: WikiPageCreateBody; path: { wikiId: string } }, init?: RestRequestInit) {
    return this.#client.post<WikiPageCreateResponse>({ body, path: url`wiki/v1/wikis/${path.wikiId}/pages` }, init);
  }

  public delete({ path }: { path: { pageId: string; wikiId: string } }, init?: RestRequestInit) {
    return this.#client.delete<EmptyRestResponse>(
      {
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}`,
      },
      init,
    );
  }

  public get({ path }: { path: { pageId: string; wikiId: string } }, init?: RestRequestInit) {
    return this.#client.get<WikiPageDetailResponse>(
      {
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}`,
      },
      init,
    );
  }

  public getById({ path }: { path: { pageId: string } }, init?: RestRequestInit) {
    return this.#client.get<WikiPageDetailResponse>({ path: url`wiki/v1/pages/${path.pageId}` }, init);
  }

  public list({ params, path }: { params?: WikiPageListParams; path: { wikiId: string } }, init?: RestRequestInit) {
    return this.#client.get<WikiPageListResponse>({ params, path: url`wiki/v1/wikis/${path.wikiId}/pages` }, init);
  }

  public listSharedLinks(
    {
      params,
      path,
    }: {
      params?: WikiPageSharedLinkListParams;
      path: { pageId: string; wikiId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.getPaginated<WikiPageSharedLinkListResponse>(
      {
        params,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/shared-links`,
      },
      init,
    );
  }

  public move(
    { body, path }: { body: WikiPageMoveBody; path: { pageId: string; wikiId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<EmptyRestResponse>(
      {
        body,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/move`,
      },
      init,
    );
  }

  public update(
    { body, path }: { body: WikiPageUpdateBody; path: { pageId: string; wikiId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}`,
      },
      init,
    );
  }

  public updateContent(
    { body, path }: { body: WikiPageUpdateContentBody; path: { pageId: string; wikiId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/content`,
      },
      init,
    );
  }

  public updateReferrers(
    { body, path }: { body: WikiPageUpdateReferrersBody; path: { pageId: string; wikiId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/referrers`,
      },
      init,
    );
  }

  public updateTitle(
    { body, path }: { body: WikiPageUpdateTitleBody; path: { pageId: string; wikiId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`wiki/v1/wikis/${path.wikiId}/pages/${path.pageId}/title`,
      },
      init,
    );
  }
}

export interface WikiPageBody {
  content: string;
  mimeType: 'text/x-markdown';
}

export interface WikiPageReferrer {
  member: { organizationMemberId: string };
  type: 'member';
}

export interface WikiPageSummary {
  creator: { member: { name?: string; organizationMemberId: string }; type: 'member' };
  id: string;
  parentPageId?: string;
  root: boolean;
  subject: string;
  version: number;
  wikiId: string;
}

export interface WikiPage {
  body: { content: string; mimeType: 'text/x-markdown' };
  createdAt: string;
  creator: { member: { name?: string; organizationMemberId: string }; type: 'member' };
  files: Array<{ attachFileId?: string; id: string; name: string; size: number }>;
  id: string;
  images: Array<{ attachFileId?: string; id: string; name: string; size: number }>;
  parentPageId?: string;
  referrers: Array<{ member: { organizationMemberId: string }; type: 'member' }>;
  root: boolean;
  subject: string;
  updatedAt: string;
  version: number;
  wikiId: string;
}

export interface WikiPageListParams {
  parentPageId?: string;
}

export interface WikiPageListResponse extends CountedRestResponse {
  result: WikiPageSummary[];
}

export interface WikiPageDetailResponse extends RestResponse {
  result: WikiPage;
}

export interface WikiPageCreateBody {
  attachFileIds?: string[];
  body: WikiPageBody;
  parentPageId: string;
  referrers?: WikiPageReferrer[];
  subject: string;
}

export interface WikiPageCreateResponse extends RestResponse {
  result: {
    id: string;
    parentPageId: string;
    version: number;
    wikiId: string;
  };
}

export interface WikiPageUpdateBody {
  body: WikiPageBody;
  referrers?: null | WikiPageReferrer[];
  subject: string;
}

export interface WikiPageUpdateTitleBody {
  subject: string;
}

export interface WikiPageUpdateContentBody {
  body: WikiPageBody;
}

export interface WikiPageUpdateReferrersBody {
  referrers: WikiPageReferrer[];
}

export interface WikiPageMoveBody {
  beforePageId?: string;
  targetParentPageId: string;
  targetWikiId?: string;
  withChildren?: boolean;
}

export interface WikiPageSharedLink {
  id: string;
  includeDescendants: boolean;
  scope: 'member' | 'memberAndGuest' | 'memberAndGuestAndExternal';
  sharedLink: string;
}

export type WikiPageSharedLinkListParams = {
  valid?: boolean;
} & PageParams;

export interface WikiPageSharedLinkListResponse extends CountedRestResponse {
  result: WikiPageSharedLink[];
}
