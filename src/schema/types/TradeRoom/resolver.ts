import { toObjectID } from 'iridium';
import { IResolver } from '../index';

const resolver: IResolver<any, any> = {
  MessageContent: {
    __resolveType({ text, pictureUrl, command }) {
      if (text) {
        return 'TextContent';
      } else if (pictureUrl) {
        return 'PictureContent';
      }
      return 'CommandContent';
    },
  },
  Message: {
    createAt({ createAt }) {
      return new Date(createAt);
    },
    async owner({ owner }, _, { database }) {
      return await database.User.findOne({ _id: owner });
    },
  },
  TradeRoom: {
    async participants({ participants }, _, { database }) {
      return await database.User.find({
        _id: {
          $in: participants.map(toObjectID),
        },
      }).toArray();
    },
    async orderProduct({ order_product }, _, { database }) {
      return await database.Product.findOne({
        _id: order_product,
      });
    },
    buyConfirm({ buy_confirm }) {
      return buy_confirm;
    },
    buyConfirmAt({ buy_confirm_at }) {
      return buy_confirm_at;
    },
    async messages({ _id }, _, { database }) {
      return await database.Message.find({ traderoom: _id }).toArray();
    },
  },
};

export default resolver;
