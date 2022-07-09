export const formatUrlWithQuery = (url: string, params: { [key: string]: string }) => {
  const [base, search] = url.split('?', 2);
  const searchParams = new URLSearchParams(search);

  for (const key of Object.keys(params)) {
    searchParams.set(key, params[key]);
  }

  return base + '?' + searchParams.toString();
};
