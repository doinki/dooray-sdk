import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ContactApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public get({ path }: { path: { contactId: string } }, init?: RestRequestInit) {
    return this.#client.get<ContactDetailResponse>({ path: url`contacts/v1/contacts/${path.contactId}` }, init);
  }

  public list({ params }: { params?: ContactListParams } = {}, init?: RestRequestInit) {
    return this.#client.getPaginated<ContactListResponse>(
      {
        params,
        path: 'contacts/v1/contacts',
      },
      init,
    );
  }

  public search({ body }: { body: ContactSearchBody }, init?: RestRequestInit) {
    return this.#client.post<ContactSearchResponse>({ body, path: 'contacts/v1/contacts/search' }, init);
  }
}

export interface Contact {
  anniversaries: Array<{ calendarType: string; type: string; typeName: string; value: string }>;
  company: string;
  created: null | string;
  department: string;
  emails: Array<{ default: boolean; emailAddress: string; type: string; typeName: string }>;
  id: string;
  jobTitle: string;
  name: string;
  nickname: string;
  note: string;
  phones: Array<{
    countryCode: string;
    default: boolean;
    number: string;
    numberWithCountryCode: string;
    type: string;
    typeName: string;
  }>;
  photo: null | string;
  socialMedia: Array<{ type: string; typeName: string; value: string }>;
  updated: null | string;
  urls: Array<{ type: string; typeName: string; value: string }>;
}

export type ContactListParams = PageParams;

export interface ContactListResponse extends CountedRestResponse {
  result: Contact[];
}

export interface ContactDetailResponse extends RestResponse {
  result: Contact;
}

export interface ContactSearchBody {
  all: string[];
}

export interface ContactSearchResult {
  company: string;
  department: string;
  emailAddress: string;
  id: string;
  jobTitle: string;
  name: string;
  nickname: string;
  profileImage: null | string;
  type: 'contact';
}

export interface ContactSearchResponse extends CountedRestResponse {
  result: ContactSearchResult[];
}
