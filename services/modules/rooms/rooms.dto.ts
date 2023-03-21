import { SortDirection } from "common/types";
import Joi from "joi";
import { RoomSortBy, RoomStatus } from "./rooms.type";

export const createRoomDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    userIds: Joi.array().items(Joi.string().uuid()).min(1).unique().required(),
  }
}).unknown(true);

export const updateRoomDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    roomId: Joi.string().uuid().required(),
  },
  body: {
    name: Joi.string().optional(),
    description: Joi.string().optional(),
  },
}).unknown(true);

export const deleteRoomDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    roomId: Joi.string().uuid().required(),
  }
}).unknown(true);

export const getManyRoomsDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  queryStringParameters: {
    roomId: Joi.string().uuid().optional(),
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().valid(...Object.values(RoomStatus)).optional(),
    createdBy: Joi.string().uuid().optional(),

    sortBy: Joi.string().valid(...Object.values(RoomSortBy)).optional(),
    sortDirection: Joi.string().valid(...Object.values(SortDirection)).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }
}).unknown(true);

export const getOneRoomDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    roomId: Joi.string().uuid().required(),
  }
}).unknown(true);