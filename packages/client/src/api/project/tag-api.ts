import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { EmptyRestResponse, RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectTagApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create({ body, path }: { body: TagCreateBody; path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.post<TagCreateResponse>({ body, path: url`project/v1/projects/${path.projectId}/tags` }, init);
  }

  public get({ path }: { path: { projectId: string; tagId: string } }, init?: RestRequestInit) {
    return this.#client.get<TagDetailResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/tags/${path.tagId}`,
      },
      init,
    );
  }

  public list({ params, path }: { params?: TagListParams; path: { projectId: string } }, init?: RestRequestInit) {
    return this.#client.getPaginated<TagListResponse>(
      {
        params,
        path: url`project/v1/projects/${path.projectId}/tags`,
      },
      init,
    );
  }

  public updateTagGroup(
    {
      body,
      path,
    }: {
      body: TagGroupUpdateBody;
      path: { projectId: string; tagGroupId: string };
    },
    init?: RestRequestInit,
  ) {
    return this.#client.put<EmptyRestResponse>(
      {
        body,
        path: url`project/v1/projects/${path.projectId}/tag-groups/${path.tagGroupId}`,
      },
      init,
    );
  }
}

export interface Tag {
  color: string;
  id: string;
  name: string;
  tagGroup: { id: string; mandatory: boolean; name: string; selectOne: boolean } | null;
}

export type TagListParams = PageParams;

export interface TagListResponse extends CountedRestResponse {
  result: Tag[];
}

export interface TagDetailResponse extends RestResponse {
  result: Tag;
}

export interface TagCreateBody {
  color: string;
  name: string;
}

export interface TagCreateResponse extends RestResponse {
  result: { id: string };
}

export interface TagGroupUpdateBody {
  mandatory?: boolean;
  selectOne?: boolean;
}
