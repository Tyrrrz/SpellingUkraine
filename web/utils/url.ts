export const withSearchParams = (url: string, params: { [key: string]: string }) => {
  const urlParsed = new URL(url);
  const searchParams = new URLSearchParams(urlParsed.searchParams);

  Object.keys(params).forEach((key) => {
    searchParams.set(key, params[key]);
  });

  urlParsed.search = searchParams.toString();

  return urlParsed.toString();
};
