import { AsyncComponents } from '../../../components/AsyncComponents';

export const Products = AsyncComponents(() => import('./Products').then((module) => module.Products));
