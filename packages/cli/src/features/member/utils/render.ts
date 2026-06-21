import { renderKeyValue } from '../../../shared/formatter/output-formatter';

interface MemberDetail {
  externalEmailAddress?: null | string;
  id: string;
  locale?: null | string;
  name: string;
  timezoneName?: null | string;
  userCode?: null | string;
}

export function renderMember({ data }: { data: MemberDetail }): string {
  return renderKeyValue([
    ['ID', data.id],
    ['Name', data.name],
    ['User Code', data.userCode],
    ['External Email', data.externalEmailAddress],
    ['Locale', data.locale],
    ['Timezone', data.timezoneName],
  ]);
}
