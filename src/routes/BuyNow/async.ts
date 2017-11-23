import { AsyncComponents } from '../../components/AsyncComponents';

export const BuyNow = AsyncComponents(() => import('./BuyNow').then((module) => module.BuyNow));
