import { SortDirection } from "common/types";
import * as Joi from "joi";
import { AppointmentsSortBy, Services, Tab } from "../../modules/appointments/appointments.type";

export const createAppointmentDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  body: {
    stylistId: Joi.string().uuid().required(),
    time: Joi.date().greater('now').required(),
    notes: Joi.string().required(),
    serviceIds: Joi.array().items(Joi.string().uuid()).unique().required(),
  },
}).unknown(true);

export const acceptAppointmentDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    appointmentId: Joi.string().uuid().required(),
  },
}).unknown(true);

export const rejectAppointmentDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  pathParameters: {
    appointmentId: Joi.string().uuid().required(),
  },
}).unknown(true);

export const getAllAppointmentsDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(true),
  queryStringParameters: Joi.object({
    stylistId: Joi.string().uuid().optional(),
    customerId: Joi.string().uuid().optional(),
    createdBy: Joi.string().uuid().optional(),
    tab: Joi.string().valid(...Object.values(Tab)).optional(),
    sortBy: Joi.string().valid(...Object.values(AppointmentsSortBy)).optional(),
    sortDirection: Joi.string().valid(...Object.values(SortDirection)).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }),
}).unknown(true)
