import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { graphql } from 'graphql';
import gql from 'graphql-tag';
import { Schema } from '../../../';
import { mongodb } from '../../../../config';
import { ServerLink } from '../../../../core/ServerLink';
import { Database } from '../../../models';
import resolver from '../resolver';

interface Query {
  helloworld: string;
}

const query = gql`query Helloworld {
  helloworld
}`;

const database = new Database({
  ...mongodb,
  database: 'test',
});

beforeEach(() => database.connect());

beforeEach(() => database.close());

describe('GraphQL Query', () => {
  it('helloworld', () => {
    const client = new ApolloClient({
      link: new ServerLink({
        schema: Schema,
      }),
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    return client.query<Query>({
      query,
    })
      .then(({ data }) => {
        // TODO: expect all fields
        // expect(data).toMatchSnapshot();
      });
  });
});
