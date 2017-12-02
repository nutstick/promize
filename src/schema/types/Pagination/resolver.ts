import { GraphQLError } from 'graphql';
import { toObjectID } from 'iridium';
import { Cursor as MongoCursor } from 'mongodb';

export type Base64String = string;

export function base64(i: string): Base64String {
  return Buffer.from(i, 'utf8').toString('base64');
}

export function unbase64(i: Base64String): string {
  return Buffer.from(i, 'base64').toString('utf8');
}

type Cursor = string;

interface SortField {
  sort: string;
  direction: 'ASC' | 'DESC';
}

export interface PaginationOption {
  name: string;
  first?: number;
  after?: Cursor;
  last?: number;
  before?: Cursor;
  orderBy?: SortField[];
}

export function toCursor(node: any, name: string, orderBy: SortField[]) {
  return base64(JSON.stringify(
    orderBy.reduce((prev, order) => ({
      ...prev,
      [order.sort]: node[order.sort],
    }), { name }),
  ));
}

export async function pagination<T = any>(cursor: MongoCursor<T>, options: PaginationOption) {
  const { after, first, before, last } = options;

  // Add default sort by _id
  const orderBy: SortField[] = options.orderBy ? options.orderBy.concat([{
    sort: '_id', direction: 'ASC',
  }]) : [{ sort: '_id', direction: 'ASC' }];

  // Parse orderBy to mongodb sort format
  const sort: any = orderBy ? orderBy.reduce((prev, order) => ({
    ...prev,
    [order.sort]: (order.direction === 'ASC' ? 1 : -1),
  }), {}) : {};

  if (after) {
    try {
      const { name, _id, ...cursorData } = JSON.parse(unbase64(after));

      if (name !== options.name) {
        throw new GraphQLError(`Type of 'after' is not a ${name}`);
      }
      // FIXME: @types/MongoDB Cursor.min(number)
      cursor = (cursor as any).min({
        ...cursorData,
        ..._id && {
          _id: toObjectID(_id),
        },
      });
    } catch (err) {
      if (err instanceof GraphQLError) {
        throw err;
      } else {
        throw new Error(`Can't parse cursor on field 'after' make use you use Cursor type`);
      }
    }
  }
  if (first) {
    cursor = cursor.limit(first + 1);
  }
  if (before) {
    try {
      const { name, _id, ...cursorData } = JSON.parse(unbase64(before));
      if (name !== options.name) {
        throw new GraphQLError(`Type of 'before' is not ${options.name}`);
      }
      // FIXME: @types/MongoDB Cursor.min(number)
      cursor = (cursor as any).max({
        ...cursorData,
        ..._id && {
          _id: toObjectID(_id),
        },
      });
    } catch (err) {
      if (err instanceof GraphQLError) {
        throw err;
      } else {
        throw new Error(`Can't parse cursor on field 'before' make use you use Cursor type`);
      }
    }
  }
  if (last) {
    cursor = cursor.limit(last + 1);
  }

  cursor = cursor.sort(sort);

  const totalCount = await cursor.count();
  const results = await cursor.toArray();

  if (results.length > (first || last)) {
    const endCursor = toCursor(results[results.length - 1], options.name, orderBy);

    return {
      totalCount,
      edges: results.slice(0, -1).map((node) => ({
        node,
        cursor: toCursor(node, options.name, orderBy),
      })),
      pageInfo: {
        endCursor,
        hasNextPage: true,
      },
    };
  }

  return {
    totalCount,
    edges: results.map((node) => ({
      node,
      cursor: toCursor(node, options.name, orderBy),
    })),
    pageInfo: {
      endCursor: null,
      hasNextPage: false,
    },
  };
}
