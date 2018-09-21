import { AsyncComponents } from '../../components/AsyncComponents';

export const Demo = AsyncComponents(() => import('./Demo').then((module) => module.Demo));
