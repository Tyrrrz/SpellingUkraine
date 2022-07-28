import { formatUrlWithQuery, joinUrl } from './url';

export const getRepoUrl = () => {
  return 'https://github.com/Tyrrrz/SpellingUkraine';
};

export const getRepoCommitUrl = (commit: string) => {
  return joinUrl(getRepoUrl(), 'commit', commit);
};

export const getRepoFileUrl = (path: string, ref: string = 'master') => {
  return joinUrl(getRepoUrl(), 'tree', ref, path);
};

export const getRepoFileEditUrl = (path: string, ref: string = 'master') => {
  return joinUrl(getRepoUrl(), 'edit', ref, path);
};

type NewIssueOptions = {
  template?: string;
  labels?: string;
  title?: string;
  details?: string;
};

export const getRepoNewIssueUrl = (options: NewIssueOptions = {}) => {
  return formatUrlWithQuery(joinUrl(getRepoUrl(), 'issues', 'new'), options);
};
