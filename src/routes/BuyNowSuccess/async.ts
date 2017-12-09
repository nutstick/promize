import { AsyncComponents } from '../../components/AsyncComponents';

export const Register = AsyncComponents(() => import('./BuyNowSuccess').then((module) => module.BuyNowSuccess));
