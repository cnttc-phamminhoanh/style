import { OrderBy } from "common/types"
import { UsersSchedule } from "./usersSchedule.entity"

export enum TimeAvailableForBooking {
  ALL_DAY = 'ALL_DAY',
  MORNING_ONLY = 'MORNING_ONLY',
  AFTERNOON_ONLY = 'AFTERNOON_ONLY',
  EVENING_ONLY = 'EVENING_ONLY',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export enum UsersScheduleSortBy {
  userId = 'userId',
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

interface ICreateUserScheduleData {
  userId: string
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

interface IUpdateUserScheduleData {
  userId: string
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

interface IFindOneUserScheduleQuery {
  userId: string
}

interface IFindManyUserScheduleQuery {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
  sortBy?: UsersScheduleSortBy
  orderBy?: OrderBy
  limit?: number
  offset?: number
}

export interface ICreateUserScheduleService {
  data: ICreateUserScheduleData
}

export interface IUpdateUserScheduleService {
  query: IFindOneUserScheduleQuery
  data: IUpdateUserScheduleData
}

export interface IFindOneUserScheduleService {
  query: IFindOneUserScheduleQuery
  checkExist?: boolean
}

export interface IFindManyUserScheduleService {
  query: IFindManyUserScheduleQuery
}

export interface IFindManyUserScheduleResult {
  list: UsersSchedule[]
  totalCount: number
}