import { AsyncComponents } from '../../components/AsyncComponents';

export const Search = AsyncComponents(() => import('./Search').then((module) => module.Search));
