import Joi from "joi";
import { TypeMessage } from "./chats.type";

export const sendMessageToChatRoomDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    message: Joi.string().required(),
    type: Joi.string().valid(...Object.values(TypeMessage)).optional(),
  },
  pathParameters: {
    roomId: Joi.string().uuid().required(),
  },
}).unknown(true);

export const getListChatMessagesDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    roomId: Joi.string().uuid().required(),
  },
  queryStringParameters: Joi.object({
    limit: Joi.number().integer().min(1).optional(),
    cursor: Joi.string().pattern(new RegExp('^(?!.*[ . | $ | # | / | \\[ | \\] ]).*$')).optional(),
  }),
}).unknown(true);

export const updateChatMessageDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    message: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(TypeMessage)).optional(),
  },
  pathParameters: {
    messageId: Joi.string().pattern(new RegExp('^(?!.*[ . | $ | # | / | \\[ | \\] ]).*$')).required(),
    roomId: Joi.string().uuid().required(),
  }
}).unknown(true);


export const deleteChatMessageDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    messageId: Joi.string().pattern(new RegExp('^(?!.*[ . | $ | # | / | \\[ | \\] ]).*$')).required(),
    roomId: Joi.string().uuid().required(),
  }
}).unknown(true);