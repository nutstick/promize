import { GraphQLInputObjectType, GraphQLString, ObjectValueNode } from 'graphql';
import * as GraphQLDate from 'graphql-date';
import { makeExecutableSchema } from 'graphql-tools';
// import * as UnionInputType from 'graphql-union-input-type';
import { print } from 'graphql/language';
import { GraphQLInt } from 'graphql/type/scalars';
import { UnionInputType } from '../core/UnionInputType';
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

const OldAddressInput = new GraphQLInputObjectType({
  name: 'OldAddressInput',
  fields: () => {
    return {
      _id: {
        type: GraphQLString,
      },
    };
  },
});

const OldPaymentMethodInput = new GraphQLInputObjectType({
  name: 'OldPaymentMethodInput',
  fields: () => {
    return {
      _id: {
        type: GraphQLString,
      },
    };
  },
});
const NewAddressInput = new GraphQLInputObjectType({
  name: 'NewAddressInput',
  fields: () => {
    return {
      address: {
        type: GraphQLString,
      },
      city: {
        type: GraphQLString,
      },
      country: {
        type: GraphQLString,
      },
      zip: {
        type: GraphQLString,
      },
    };
  },
});

const NewPaymentMethodInput = new GraphQLInputObjectType({
  name: 'NewPaymenMethodtInput',
  fields: () => {
    return {
      creditCardNumber: {
        type: GraphQLString,
      },
      validFromMonth: {
        type: GraphQLInt,
      },
      validFromYear: {
        type: GraphQLInt,
      },
    };
  },
});

const AddressInputCreate = new UnionInputType({
  name: 'AddressInputCreate',
  inputTypes: [OldAddressInput, NewAddressInput],
  resolveTypeFromValue(value) {
    if (value._id) {
      return OldAddressInput;
    } else {
      return NewAddressInput;
    }
  },
  resolveTypeFromAst: function resolveTypeFromAst(ast) {
    if ((ast as ObjectValueNode).fields[0].name.value === '_id') {
      return OldAddressInput;
    } else {
      return NewAddressInput;
    }
  },
});

const PaymentInputCreate = new UnionInputType({
  name: 'PaymentMethodInputCreate',
  inputTypes: [OldPaymentMethodInput, NewPaymentMethodInput],
  resolveTypeFromValue(value) {
    if (value._id) {
      return OldPaymentMethodInput;
    } else {
      return NewPaymentMethodInput;
    }
  },
  resolveTypeFromAst: function resolveTypeFromAst(ast) {
    if ((ast as ObjectValueNode).fields[0].name.value === '_id') {
      return OldPaymentMethodInput;
    } else {
      return NewPaymentMethodInput;
    }
  },
});

const Keyword = new UnionInputType({
  name: 'Keyword',
  inputTypes: [UserIDKeyword, HashtagKeyword, SpecialKeyword],
  resolveTypeFromAst: function resolveTypeFromAst(ast) {
    if ((ast as ObjectValueNode).fields[0].name.value === 'id') {
      return UserIDKeyword;
    } else if ((ast as ObjectValueNode).fields[0].name.value === 'keyword') {
      return HashtagKeyword;
    } else {
      return SpecialKeyword;
    }
  },
});

const resolvers = Object.assign({
  Date: GraphQLDate,
  // Time: GraphQLString,
  Keyword,
  AddressInputCreate,
  PaymentInputCreate,
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
