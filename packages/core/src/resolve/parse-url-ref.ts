import { RefError } from './errors';
import { DOORAY_ID_PATTERN } from './ref-format';

export type UrlRefType = 'drive' | 'task' | 'wiki';

export interface UrlRef {
  id?: string;
  projectId?: string;
  type: UrlRefType;
}

interface Route {
  ambiguous: boolean;
  prefix: string;
  type: UrlRefType;
}

const ROUTES: Route[] = [
  { ambiguous: false, prefix: '/project/tasks/', type: 'task' },
  { ambiguous: true, prefix: '/task/', type: 'task' },
  { ambiguous: false, prefix: '/project/drive-files/', type: 'drive' },
  { ambiguous: true, prefix: '/drive/', type: 'drive' },
  { ambiguous: false, prefix: '/project/pages/', type: 'wiki' },
  { ambiguous: true, prefix: '/wiki/', type: 'wiki' },
];

export function parseUrlRef(url: URL): UrlRef {
  const route = ROUTES.find((r) => url.pathname.startsWith(r.prefix));
  if (!route) throw new RefError(url.href);

  const rest = url.pathname.slice(route.prefix.length).split('/').filter(Boolean);

  if (!route.ambiguous) {
    const id = rest.find((s) => DOORAY_ID_PATTERN.test(s));
    if (!id) throw new RefError(url.href);
    return { id, type: route.type };
  }

  const [first, ...tail] = rest;
  if (!first) throw new RefError(url.href);

  if (DOORAY_ID_PATTERN.test(first)) {
    const second = tail.find((s) => DOORAY_ID_PATTERN.test(s));
    if (second) return { id: second, projectId: first, type: route.type };
    return { projectId: first, type: route.type };
  }

  const id = tail.find((s) => DOORAY_ID_PATTERN.test(s));
  if (!id) throw new RefError(url.href);
  return { id, type: route.type };
}
