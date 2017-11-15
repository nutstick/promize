import { Location } from 'history';

export function parseSearch(search: Location) {
  const q: string = search.search.slice(1);

  const parseResult: any = q.split('&').reduce((prev, param) => {
    const parts = param.replace(/\%20/g, ' ').split('=');
    const key = parts.shift();
    const val = parts.length > 0 ? parts.join('=') : undefined;

    return {
      ...prev,
      [key]: val,
    };
  }, {});
  try {
    return search.pathname === '/search' && parseResult.keyword;
  } catch {
    return '';
  }
}