import { SortDirection } from "common/types";
import Joi from "joi";
import { ProposalServiceSortBy } from "./proposalsServices.type";

export const updateProposalServiceDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    price: Joi.number().min(0).required()
  },
  pathParameters: {
    proposalServiceId: Joi.string().uuid().required(),
  },
}).unknown(true);

export const createProposalServiceDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    proposalId: Joi.string().uuid().required(),
    serviceId: Joi.string().uuid().required(),
    price: Joi.number().min(0).required()
  }
}).unknown(true);

export const deleteProposalServiceDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    proposalServiceId: Joi.string().uuid().required(),
  },
}).unknown(true);

export const getManyProposalServicesDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  queryStringParameters: Joi.object({
    proposalServiceId: Joi.string().uuid().optional(),
    stylistId: Joi.string().uuid().optional(),
    customerId: Joi.string().uuid().optional(),
    serviceId: Joi.string().uuid().optional(),
    proposalId: Joi.string().uuid().optional(),
    fromPrice: Joi.number().min(0).optional(),
    toPrice: Joi.number().min(0).optional(),
    sortBy: Joi.string().valid(...Object.values(ProposalServiceSortBy)).optional(),
    sortDirection: Joi.string().valid(...Object.values(SortDirection)).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }).custom((value) => {
    if (value.fromPrice && value.toPrice && value.fromPrice >= value.toPrice) {
      throw new Error('fromPrice must be less than toPrice')
    }

    return value
  }, 'validate queryStringParameters')
}).unknown(true);