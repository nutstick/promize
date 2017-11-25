import { AsyncComponents } from '../../../components/AsyncComponents';

export const NotFound = AsyncComponents(() => import('./Account').then((module) => module.Account));
