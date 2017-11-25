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
  if (search.pathname === '/search' ) {
    const q: string = search.search.slice(1);

    const parseResult: { keywords?: string, [key: string]: string } = q.split('&').reduce((prev, param) => {
      const parts = param
        .replace(/\%20/g, ' ')
        .replace(/\%22/g, '\"')
        .split('=');
      const key = parts.shift();
      const val = parts.length > 0 ? parts.join('=') : undefined;

      return {
        ...prev,
        [key]: val,
      };
    }, {});

    try {
      return parseResult.keywords.split(',').map((keyword) => JSON.parse(keyword));
    } catch {
      return [];
    }
  } else if (search.pathname.match(/^\/users\/[a-z0-9]/)) {
    return [{ id: search.pathname.split('/')[2] }];
  }
  return [];
}
