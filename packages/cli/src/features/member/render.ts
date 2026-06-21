import { renderKeyValue } from '../../shared/formatter/output-formatter';

/** Structural view over the member detail shared by `member me` and `member view`. */
interface MemberDetail {
  externalEmailAddress?: null | string;
  id: string;
  locale?: null | string;
  name: string;
  timezoneName?: null | string;
  userCode?: null | string;
}

/** The shared member key-value detail render for `member me` and `member view`. */
export function renderMember({ data: member }: { data: MemberDetail }): string {
  return renderKeyValue([
    ['ID', member.id],
    ['Name', member.name],
    ['User Code', member.userCode],
    ['External Email', member.externalEmailAddress],
    ['Locale', member.locale],
    ['Timezone', member.timezoneName],
  ]);
}
