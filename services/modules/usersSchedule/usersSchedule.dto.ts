import { OrderBy } from 'common/types'
import * as Joi from 'joi'
import { TimeAvailableForBooking } from './usersSchedule.type'

const usersScheduleSortBy = [
  'userId',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
  'highlights',
  'createdAt',
  'updatedAt',
]

const usersScheduleOrderBy = [
  OrderBy.ASC,
  OrderBy.DESC,
]

const timeAvailableForBooking = [
  TimeAvailableForBooking.ALL_DAY,
  TimeAvailableForBooking.AFTERNOON_ONLY,
  TimeAvailableForBooking.EVENING_ONLY,
  TimeAvailableForBooking.MORNING_ONLY,
  TimeAvailableForBooking.NOT_AVAILABLE,
]

const scheduleOption = Joi.string().valid(...timeAvailableForBooking).optional()

export const createUsersScheduleDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: {
    monday: scheduleOption,
    tuesday: scheduleOption,
    wednesday: scheduleOption,
    thursday: scheduleOption,
    friday: scheduleOption,
    saturday: scheduleOption,
    sunday: scheduleOption,
  }
}).unknown(true)

export const updateUsersScheduleDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  body: {
    monday: scheduleOption,
    tuesday: scheduleOption,
    wednesday: scheduleOption,
    thursday: scheduleOption,
    friday: scheduleOption,
    saturday: scheduleOption,
    sunday: scheduleOption,
  }
}).unknown(true)

export const getOneUserScheduleDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  pathParameters: {
    userId: Joi.string().required(),
  }
}).unknown(true)

export const getAllUserScheduleDto = Joi.object({
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown(true),
  queryStringParameters: {
    monday: scheduleOption,
    tuesday: scheduleOption,
    wednesday: scheduleOption,
    thursday: scheduleOption,
    friday: scheduleOption,
    saturday: scheduleOption,
    sunday: scheduleOption,
    sortBy: Joi.string().valid(...usersScheduleSortBy).optional(),
    orderBy: Joi.string().valid(...usersScheduleOrderBy).optional(),
    limit: Joi.number().integer().min(1).optional(),
    offset: Joi.number().integer().min(1).optional(),
  }
}).unknown(true)