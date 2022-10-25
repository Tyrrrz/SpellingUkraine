export const isAbsoluteUrl = (url: string) => {
  return /^[a-z][a-z\d+\-.]*:/iu.test(url);
};

export const joinUrl = (...urls: string[]) => {
  return urls.reduce((prev, cur) => {
    const prevWithSlash = prev.endsWith('/') ? prev : prev + '/';
    return new URL(cur, prevWithSlash).href;
  });
};

export const formatUrlWithQuery = (url: string, params: { [key: string]: string }) => {
  const [base, search] = url.split('?', 2);
  const searchParams = new URLSearchParams(search);

  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, value);
  }

  return base + '?' + searchParams.toString();
};
