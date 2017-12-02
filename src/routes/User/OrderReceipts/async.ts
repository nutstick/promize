import { AsyncComponents } from '../../../components/AsyncComponents';

export const NotFound = AsyncComponents(() => import('./OrderReceipts').then((module) => module.OrderReceipts));
