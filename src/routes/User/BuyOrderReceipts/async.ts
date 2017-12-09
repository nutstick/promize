import { AsyncComponents } from '../../../components/AsyncComponents';

export const NotFound = AsyncComponents(() => import('./BuyOrderReceipts').then((module) => module.BuyOrderReceipts));
