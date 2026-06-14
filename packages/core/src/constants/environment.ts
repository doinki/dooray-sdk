export type EnvironmentId = 'commercial' | 'finance' | 'gov-private' | 'gov';

export interface DoorayEnvironment {
  baseUrl: string;
  description: string;
  id: EnvironmentId;
  label: string;
}

export const DEFAULT_BASE_URL = 'https://api.dooray.com';

export const DOORAY_ENVIRONMENTS = [
  {
    baseUrl: DEFAULT_BASE_URL,
    description: 'NHN Dooray',
    id: 'commercial',
    label: '민간',
  },
  {
    baseUrl: 'https://api.gov-dooray.com',
    description: '공공 Dooray',
    id: 'gov',
    label: '공공',
  },
  {
    baseUrl: 'https://api.gov-dooray.co.kr',
    description: '공공업무망 Dooray',
    id: 'gov-private',
    label: '공공업무망',
  },
  {
    baseUrl: 'https://api.dooray.co.kr',
    description: '금융 Dooray',
    id: 'finance',
    label: '금융',
  },
] as const satisfies readonly DoorayEnvironment[];

export function findEnvironmentById(id: string): DoorayEnvironment | undefined {
  return DOORAY_ENVIRONMENTS.find((env) => env.id === id);
}
