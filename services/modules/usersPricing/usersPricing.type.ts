import { OrderBy } from "common/types"
import { UsersPricing } from "./usersPricing.entity"

export enum UsersPricingSortBy {
  USERID = 'userId',
  HAIR_CUT = 'hairCut',
  TRIM = 'trim',
  EXTENSIONS = 'extensions',
  KERATINE = 'keratine',
  COLOR = 'color',
  PERM = 'perm',
  CURLING = 'curling',
  HIGHLIGHTS = 'highlights',
  CONDITIONING = 'conditioning',
  SCALP_MESSAGE = 'scalpMessage',
  FLEXIBILITY = 'flexibility',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

interface ICreateUserPricingData {
  userId: string
  hairCut?: boolean
  trim?: boolean
  color?: boolean
  perm?: boolean
  curling?: boolean
  extensions?: boolean
  keratine?: boolean
  highlights?: boolean
  conditioning?: boolean
  scalpMessage?: boolean
  flexibility?: number
}

interface IUpdateUserPricingData {
  hairCut?: boolean
  trim?: boolean
  color?: boolean
  perm?: boolean
  curling?: boolean
  extensions?: boolean
  keratine?: boolean
  highlights?: boolean
  conditioning?: boolean
  scalpMessage?: boolean
  flexibility?: number
}

interface IFindOneUserPricingQuery {
  userId: string
}

interface IFindManyUserPricingQuery {
  userId?: string
  hairCut?: boolean
  trim?: boolean
  color?: boolean
  perm?: boolean
  curling?: boolean
  extensions?: boolean
  keratine?: boolean
  highlights?: boolean
  conditioning?: boolean
  scalpMessage?: boolean
  flexibility?: number
  sortBy?: UsersPricingSortBy
  orderBy?: OrderBy
  limit?: number
  offset?: number
}

export interface ICreateUserPricingService {
  data: ICreateUserPricingData
}

export interface IUpdateUserPricingService {
  query: IFindOneUserPricingQuery
  data: IUpdateUserPricingData
}

export interface IFindOneUserPricingService {
  query: IFindOneUserPricingQuery
  checkExist?: boolean
}

export interface IFindManyUserPricingService {
  query: IFindManyUserPricingQuery
}

export interface IFindManyUserPricingResult {
  list: UsersPricing[]
  totalCount: number
}