import { FindOperator } from "typeorm"

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

interface ICreateUserData {
  phoneNumber?: string
  email?: string
  firstName?: string
  lastName?: string
  address?: string
  latitude?: number
  longitude?: number
  gender?: Gender
  status?: UserStatus
  bio?: string
  avatar?: string
  provider?: string
  providerId?: string
  firebaseId?: string
}

export interface IUpdateUserData {
  phoneNumber?: string
  email?: string
  firstName?: string
  lastName?: string
  address?: string
  latitude?: number
  longitude?: number
  gender?: Gender
  status?: UserStatus
  bio?: string
  avatar?: string
}

interface IFindOneUserQuery {
  userId?: string | FindOperator<string>
  email?: string
  phoneNumber?: string
  status?: UserStatus
  providerId?: string
  provider?: string
}

export interface ICreateUserService {
  data: ICreateUserData
}

export interface IUpdateUserService {
  query: IFindOneUserQuery
  data: IUpdateUserData
}

export interface IFindOneUserService {
  query: IFindOneUserQuery
  checkExist?: boolean
  relations?: string[]
}

interface IFindManyByUserIdsQuery {
  userIds: string[]
}

export interface IFindManyByUserIdsService {
  query: IFindManyByUserIdsQuery
  relations?: string[]
}

export enum NextAction {
  SIGNUP = 'SIGNUP'
}

export interface IVerifyOTPResult {
  accessToken: string
  nextAction?: NextAction
}

export interface ILoginOrSignUpResult {
  accessToken: string
}

export enum Provider {
  STYLE_VIDIA = 'STYLE_VIDIA',
  GOOGLE = 'GOOGLE',
  APPLE = 'APPLE'
}

interface IPreFillData {
  firstName?: string
  lastName?: string
  email?: string
}

export interface ILoginWithFirebaseResult {
  accessToken: string
  nextAction?: NextAction
  preFillData?: IPreFillData
}

export enum IFirebaseIdentities {
  GOOGLE = 'google.com',
  APPLE = 'apple.com'
}