import { formatUrlWithQuery, joinUrl } from '@/utils/url';

export const getRepoUrl = () => {
  return 'https://github.com/Tyrrrz/SpellingUkraine';
};

export const getRepoCommitUrl = (commit: string) => {
  return joinUrl(getRepoUrl(), 'commit', commit);
};

export const getRepoFileUrl = (path: string, options?: { ref: string }) => {
  return joinUrl(getRepoUrl(), 'tree', options?.ref || 'master', path);
};

export const getRepoFileEditUrl = (path: string, options?: { ref: string }) => {
  return joinUrl(getRepoUrl(), 'edit', options?.ref || 'master', path);
};

export const getRepoNewIssueUrl = (options?: {
  template?: string;
  labels?: string;
  title?: string;
  details?: string;
}) => {
  return formatUrlWithQuery(joinUrl(getRepoUrl(), 'issues', 'new'), options || {});
};
