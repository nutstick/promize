import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import * as GraphQLDate from 'graphql-date';
import { makeExecutableSchema } from 'graphql-tools';
import * as UnionInputType from 'graphql-union-input-type';
import { print } from 'graphql/language';
import * as SchemaType from './schema.gql';
import * as IntlMessage from './types/IntlMessage';
import * as Mutation from './types/Mutation';
import * as OrderReceipt from './types/OrderReceipt';
import * as Pagination from './types/Pagination';
import * as Product from './types/Product';
import * as Query from './types/Query';
import * as User from './types/User';

const schema = [print(SchemaType)];
const modules = [
  Pagination,
  User,
  IntlMessage,
  Query,
  Product,
  OrderReceipt,
  Mutation,
];

const UserIDKeyword = new GraphQLInputObjectType({
  name: 'UserIDKeywordInput',
  fields: () => {
    return {
      id: {
        type: GraphQLString,
      },
    };
  },
});

const HashtagKeyword = new GraphQLInputObjectType({
  name: 'HashtagKeywordInput',
  fields: () => {
    return {
      keyword: {
        type: GraphQLString,
      },
    };
  },
});

const SpecialKeyword = new GraphQLInputObjectType({
  name: 'SpecialKeywordInput',
  fields: () => {
    return {
      special_keyword: {
        type: GraphQLString,
      },
    };
  },
});

const resolvers = Object.assign({
  Date: GraphQLDate,
  // Time: GraphQLString,
  Keyword: new UnionInputType({
    name: 'Keyword',
    InputType: [UserIDKeyword, HashtagKeyword, SpecialKeyword],
    resolveTypeFromAst: function resolveTypeFromAst(ast) {
      print(ast.fields[0]);
      if (ast.fields[0].name.value === 'id') {
        return UserIDKeyword;
      } else if (ast.fields[0].name.value === 'keyword') {
        return HashtagKeyword;
      } else {
        return SpecialKeyword;
      }
    },
  }),
},
  ...(modules.map((m) => m.resolver).filter((res) => res)),
);

const typeDefs = schema.concat(modules.map((m) => print(m.type)).filter((res) => !!res));

const Schema = makeExecutableSchema({
  logger: console,
  resolverValidationOptions: {
    requireResolversForNonScalar: false,
  },
  resolvers,
  typeDefs,
});

export { Schema };
