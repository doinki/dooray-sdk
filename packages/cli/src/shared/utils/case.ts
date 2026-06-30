/**
 * String-case converters shared across the CLI's arg/flag plumbing.
 * Each preserves the exact behavior of the inline helper it replaced — they are
 * not interchangeable (kebab/camel are inverses; snake also collapses dashes).
 */

const UPPERCASE = /[A-Z]/g;
const KEBAB_BOUNDARY = /-([a-z0-9])/g;
const CAMEL_BOUNDARY = /([a-z0-9])([A-Z])/g;

/** camelCase → kebab-case (`projectId` → `project-id`). */
export function kebabCase(value: string): string {
  return value.replaceAll(UPPERCASE, (char) => `-${char.toLowerCase()}`);
}

/** kebab-case → camelCase (`project-id` → `projectId`); a no-op when there's no `-`. */
export function camelCase(value: string): string {
  return value.includes('-') ? value.replaceAll(KEBAB_BOUNDARY, (_, char: string) => char.toUpperCase()) : value;
}

/** camelCase or kebab-case → snake_case (`projectId` / `project-id` → `project_id`). */
export function snakeCase(value: string): string {
  return value.replaceAll(CAMEL_BOUNDARY, '$1_$2').replaceAll('-', '_').toLowerCase();
}
