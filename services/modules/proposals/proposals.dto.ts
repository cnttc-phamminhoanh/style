import { SortDirection } from "common/types";
import Joi from "joi";
import { ProposalsSortBy, ProposalsStatus } from "./proposals.type";

export const createProposalDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    customerRequestId: Joi.string().uuid().required(),
    message: Joi.string().required(),
    images: Joi.array().items(Joi.string()).min(1).unique().optional(),
    services: Joi.array().items({
      serviceId: Joi.string().required(),
      price: Joi.number().min(0).optional()
    }).unique('serviceId').min(1).required(),
  },
}).unknown(true);

export const updateProposalDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    proposalId: Joi.string().uuid().required(),
  },
  body: {
    message: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).min(1).unique().optional(),
  },
}).unknown(true);

export const deleteProposalDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    proposalId: Joi.string().uuid().required(),
  }
}).unknown(true);

export const getOneProposalDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    proposalId: Joi.string().uuid().required(),
  }
}).unknown(true);

export const getManyProposalsDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  queryStringParameters: {
    customerRequestId: Joi.string().uuid().optional(),
    stylistId: Joi.string().uuid().optional(),
    customerId: Joi.string().uuid().optional(),
    message: Joi.string().optional(),
    status: Joi.string().valid(...Object.values(ProposalsStatus)).optional(),
    sortBy: Joi.string().valid(...Object.values(ProposalsSortBy)).optional(),
    sortDirection: Joi.string().valid(...Object.values(SortDirection)).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }
}).unknown(true);

export const acceptProposalDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    proposalId: Joi.string().uuid().required(),
  },
}).unknown(true);