
import { GraphQLInputObjectType, GraphQLList, GraphQLString, ObjectValueNode } from 'graphql';
import { GraphQLInt } from 'graphql/type/scalars';
import { UnionInputType } from '../core/UnionInputType';

const TextMessage = new GraphQLInputObjectType({
  name: 'TextMessage',
  fields: () => {
    return {
      text: {
        type: GraphQLString,
      },
    };
  },
});

const ImageMessage = new GraphQLInputObjectType({
  name: 'ImageMessage',
  fields: () => {
    return {
      pictureUrl: {
        type: GraphQLString,
      },
      size: {
        type: GraphQLInt,
      },
    };
  },
});

const CommandMessage = new GraphQLInputObjectType({
  name: 'CommandMessage',
  fields: () => {
    return {
      command: {
        type: GraphQLString,
      },
      arguments: {
        type: new GraphQLList(GraphQLString),
      },
    };
  },
});

export const MessageContentInput = new UnionInputType({
  name: 'MessageContentInput',
  inputTypes: [TextMessage, ImageMessage, CommandMessage],
  resolveTypeFromValue(value) {
    if (value.text) {
      return TextMessage;
    } else if (value.pictureUrl) {
      return ImageMessage;
    } else if (value.command) {
      return CommandMessage;
    }
    return null;
  },
  resolveTypeFromAst(ast) {
    if ((ast as ObjectValueNode).fields[0].name.value === 'text') {
      return TextMessage;
    } else if ((ast as ObjectValueNode).fields[0].name.value === 'pictureUrl') {
      return ImageMessage;
    } else if ((ast as ObjectValueNode).fields[0].name.value === 'command') {
      return CommandMessage;
    }
    return null;
  },
});
