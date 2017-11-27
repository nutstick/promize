import { AsyncComponents } from '../../../components/AsyncComponents';

export const NotFound = AsyncComponents(() => import('./CreateProduct').then((module) => module.CreateProduct));
