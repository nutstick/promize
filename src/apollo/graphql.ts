import { graphql as __graphql, OperationOption } from 'react-apollo';

export function graphql<TProps, TResult>(gqlQuery, operationOptions?: OperationOption<TProps, TResult>): any {
  return __graphql(gqlQuery, operationOptions);
}
