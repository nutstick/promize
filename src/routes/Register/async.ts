import { AsyncComponents } from '../../components/AsyncComponents';

export const Register = AsyncComponents(() => import('./Register').then((module) => module.Register));
