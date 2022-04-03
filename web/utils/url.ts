export const withSearchParams = (url: string, params: { [key: string]: string }) => {
  const [base, search] = url.split('?');

  const searchParams = new URLSearchParams(search);
  Object.keys(params).forEach((key) => {
    searchParams.set(key, params[key]);
  });

  return base + '?' + searchParams.toString();
};
