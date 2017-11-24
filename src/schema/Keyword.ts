import { GraphQLInputObjectType, GraphQLString, ObjectValueNode } from 'graphql';
import { UnionInputType } from '../core/UnionInputType';

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

export const Keyword = new UnionInputType({
  name: 'Keyword',
  inputTypes: [UserIDKeyword, HashtagKeyword, SpecialKeyword],
  resolveTypeFromValue(value) {
    console.log(value);
    if (value.id) {
      return UserIDKeyword;
    } else if (value.keyword) {
      return HashtagKeyword;
    } else if (value.special_keyword) {
      return SpecialKeyword;
    }
    return null;
  },
  resolveTypeFromAst(ast) {
    if ((ast as ObjectValueNode).fields[0].name.value === 'id') {
      return UserIDKeyword;
    } else if ((ast as ObjectValueNode).fields[0].name.value === 'keyword') {
      return HashtagKeyword;
    } else if ((ast as ObjectValueNode).fields[0].name.value === 'special_keyword'){
      return SpecialKeyword;
    }
    return null;
  },
});
