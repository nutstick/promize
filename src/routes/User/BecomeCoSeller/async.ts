import { AsyncComponents } from '../../../components/AsyncComponents';

export const NotFound = AsyncComponents(() => import('./BecomeCoSeller').then((module) => module.BecomeCoSeller));
