import { AsyncComponents } from '../../../components/AsyncComponents';

export const NotFound = AsyncComponents(() => import('./PaymentMethod').then((module) => module.PaymentMethod));
