import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class MemberApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public get({ path }: { path: { memberId: string } }, init?: RestRequestInit) {
    return this.#client.get<MemberDetailResponse>({ path: url`common/v1/members/${path.memberId}` }, init);
  }

  public search({ params }: { params?: MemberSearchParams } = {}, init?: RestRequestInit) {
    return this.#client.getPaginated<MemberSearchResponse>(
      {
        params,
        path: 'common/v1/members',
      },
      init,
    );
  }

  public getMe(_?: unknown, init?: RestRequestInit) {
    return this.#client.get<MemberDetailResponse>({ path: 'common/v1/members/me' }, init);
  }
}

export type MemberSearchParams = {
  externalEmailAddresses?: string[];
  idProviderUserId?: string;
  name?: string;
  userCode?: string;
  userCodeExact?: string;
} & PageParams;

export interface MemberSearchResponse extends CountedRestResponse {
  result: Array<{ externalEmailAddress: string; id: string; name: string; userCode: string }>;
}

export interface Member {
  defaultOrganization: { id: string };
  displayMemberId: null | string;
  englishName: null | string;
  externalEmailAddress: string;
  id: string;
  idProviderType: 'service';
  idProviderUserId: string;
  locale: string;
  name: string;
  nativeName: null | string;
  nickname: null | string;
  timezoneName: string;
  userCode: string;
}

export interface MemberDetailResponse extends RestResponse {
  result: Member;
}
