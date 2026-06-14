import type { DoorayClient } from '../../lib/dooray-client';
import type { CountedRestResponse, PageParams } from '../../lib/pagination';
import type { RestRequestInit } from '../../lib/rest-request';
import type { RestResponse } from '../../lib/rest-response';
import { url } from '../../lib/url';

export class ResourceApi {
  readonly #client: DoorayClient;

  public constructor(client: DoorayClient) {
    this.#client = client;
  }

  public get({ path }: { path: { resourceId: string } }, init?: RestRequestInit) {
    return this.#client.get<ResourceDetailResponse>({ path: url`reservation/v1/resources/${path.resourceId}` }, init);
  }

  public list({ params }: { params?: ResourceListParams } = {}, init?: RestRequestInit) {
    return this.#client.get<ResourceListResponse>({ params, path: 'reservation/v1/resources' }, init);
  }

  public listCategories({ params }: { params?: ResourceCategoryListParams } = {}, init?: RestRequestInit) {
    return this.#client.getPaginated<ResourceCategoryListResponse>(
      {
        params,
        path: 'reservation/v1/resource-categories',
      },
      init,
    );
  }

  public listReservable({ params }: { params?: ReservableResourceListParams } = {}, init?: RestRequestInit) {
    return this.#client.get<ReservableResourceListResponse>(
      { params, path: 'reservation/v1/reservable-resources' },
      init,
    );
  }
}

export type ResourceCategoryType = 'meetingRoom' | 'mobile' | 'oa' | 'vehicle';

export interface ResourceCategory {
  id: string;
  name: string;
  type: ResourceCategoryType;
}

export type ResourceCategoryListParams = PageParams;

export interface ResourceCategoryListResponse extends CountedRestResponse {
  result: ResourceCategory[];
}

export interface Resource {
  id: string;
  name: string;
  use: boolean;
}

export interface ResourceListParams {
  resourceCategoryId?: string;
}

export interface ResourceListResponse extends CountedRestResponse {
  result: Resource[];
}

export interface MeetingRoomDetail {
  capacity: number;
  conferencingAvailable: boolean;
  meetingRoomType: 'meetingRoom' | 'recordingRoom';
  mobilePresentationAvailable: boolean;
  presentationAvailable: boolean;
}

export interface OaDetail {
  deviceDescription: string;
  deviceType: 'camcorder' | 'camera' | 'desktop' | 'laptop' | 'monitor' | 'others' | 'projector';
  manufacturer: string;
  serialNumber: string;
}

export interface MobileDetail {
  deviceDescription: string;
  managementNumber: string;
  manufacturer: string;
  osType: 'android' | 'ios';
  osVersion: string;
  serialNumber: string;
}

export interface VehicleDetail {
  capacity: number;
  deviceDescription: string;
  licensePlateNumber: string;
  managementNumber: string;
  serialNumber: string;
  vehicleType: 'compactCar' | 'fullSizeSedan' | 'mediumSedan';
}

export type ResourceTypeDetail =
  | { meetingRoom: MeetingRoomDetail; resourceCategoryType: 'meetingRoom' }
  | { mobile: MobileDetail; resourceCategoryType: 'mobile' }
  | { oa: OaDetail; resourceCategoryType: 'oa' }
  | { resourceCategoryType: 'vehicle'; vehicle: VehicleDetail };

export type ResourceUser =
  | { department: { departmentId: string }; type: 'department' }
  | { member: { organizationMemberId: string }; type: 'member' };

export interface ResourceUsers {
  managers: ResourceUser[];
  users: ResourceUser[];
}

export interface ResourceDetail extends Resource {
  advanceReservationDays: number;
  description: string;
  detail?: ResourceTypeDetail;
  displayOrder: number;
  maxRepeatYear: number;
  operatingHoursClose: string;
  operatingHoursOpen: string;
  operatingHoursTimezoneName: string;
  repeatable: boolean;
  reservationUnit: 'day' | 'hour' | 'hourDay';
  resourceCategory: { id: string };
  useAdvanceReservationDays: boolean;
  useApproval: boolean;
  users: ResourceUsers;
}

export interface ResourceDetailResponse extends RestResponse {
  result: ResourceDetail;
}

export interface ReservableResource {
  id: string;
  name: string;
  use: boolean;
}

export interface ReservableResourceListParams {
  resourceCategoryId?: string;
}

export interface ReservableResourceListResponse extends CountedRestResponse {
  result: ReservableResource[];
}
