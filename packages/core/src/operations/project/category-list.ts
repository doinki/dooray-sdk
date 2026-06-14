import type { DoorayApi } from '@dooray-sdk/client';
import type { ProjectCategory } from '@dooray-sdk/client/project';

interface ProjectCategoryListContext {
  api: DoorayApi;
}

interface ProjectCategoryNode {
  category: ProjectCategory;
  depth: number;
}

export async function runProjectCategoryList(context: ProjectCategoryListContext) {
  const { api } = context;

  const { result } = await api.projectCategory.list();

  return flattenCategoriesAsTree(result);
}

function flattenCategoriesAsTree(categories: ProjectCategory[]) {
  const collator = new Intl.Collator();
  const byOrderThenName = (a: ProjectCategory, b: ProjectCategory): number =>
    a.order - b.order || collator.compare(a.name, b.name);

  const childrenByParent = new Map<null | string, ProjectCategory[]>();

  for (const c of categories) {
    const siblings = childrenByParent.get(c.parentProjectCategoryId);
    if (siblings) siblings.push(c);
    else childrenByParent.set(c.parentProjectCategoryId, [c]);
  }

  for (const siblings of childrenByParent.values()) siblings.sort(byOrderThenName);

  const result: ProjectCategoryNode[] = [];
  const visited = new Set<string>();

  function walk(parentId: null | string, depth: number): void {
    const children = childrenByParent.get(parentId);
    if (!children) return;
    for (const child of children) {
      if (visited.has(child.id)) continue;
      visited.add(child.id);
      result.push({ category: child, depth });
      walk(child.id, depth + 1);
    }
  }

  walk(null, 0);

  if (result.length !== categories.length) {
    const orphans = categories.filter((c) => !visited.has(c.id)).toSorted(byOrderThenName);
    for (const c of orphans) result.push({ category: c, depth: 0 });
  }

  return { data: result };
}
