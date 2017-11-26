import { AsyncComponents } from '../../components/AsyncComponents';

export const Register = AsyncComponents(() => import('./User').then((module) => module.User));
