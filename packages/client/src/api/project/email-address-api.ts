import type { DoorayClient } from '../../lib/dooray-client';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ProjectEmailAddressApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public create(
    { body, path }: { body: ProjectEmailAddressCreateBody; path: { projectId: string } },
    init?: RestRequestInit,
  ) {
    return this.#client.post<ProjectEmailAddressCreateResponse>(
      { body, path: url`project/v1/projects/${path.projectId}/email-addresses` },
      init,
    );
  }

  public get({ path }: { path: { emailAddressId: string; projectId: string } }, init?: RestRequestInit) {
    return this.#client.get<ProjectEmailAddressDetailResponse>(
      {
        path: url`project/v1/projects/${path.projectId}/email-addresses/${path.emailAddressId}`,
      },
      init,
    );
  }
}

export interface ProjectEmailAddress {
  emailAddress: string;
  id: string;
  name: string;
}

export interface ProjectEmailAddressCreateBody {
  emailAddress: string;
  name: string;
}

export interface ProjectEmailAddressCreateResponse extends RestResponse {
  result: { id: string };
}

export interface ProjectEmailAddressDetailResponse extends RestResponse {
  result: ProjectEmailAddress;
}
