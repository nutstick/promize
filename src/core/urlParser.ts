import { Location } from 'history';

export function parse(search: Location) {
  const q: string = search.search.slice(1);

  const parseResult: any = q.split('&').reduce((prev, param) => {
    const parts = param.replace(/\%20/g, ' ').split('=');
    const key = parts.shift();
    const val = parts.length > 0 ? parts.join('=') : undefined;

    return key ? {
      ...prev,
      [key]: val,
    } : prev;
  }, {});

  return parseResult;
}

export function stringify(search: any) {
  const searchString = Object.keys(search).reduce((prev, key) => `${prev}&${key}=${search[key]}`, '').slice(1);
  return `?${searchString}`;
}

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
