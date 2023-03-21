import { Credentials, SortDirection } from "common/types";
import { CustomerRequests } from "./customerRequests.entity";

export enum CustomerRequestSortBy {
  PRICE = 'price',
  TIME = 'time',
  CREATED_AT = 'createdAt'
}

interface ICreateCustomerRequestData {
    customerId: string
    currentPictures: string[]
    samplePictures: string[]
    price: number
    time: Date
}

export interface ICreateCustomerRequest {
  data: ICreateCustomerRequestData
}

interface IUpdateCustomerRequestData {
  currentPictures?: string[]
  samplePictures?: string[]
  status?: CustomerRequestsStatus
  price?: number
  time?: Date
}

interface IFindOneCustomerRequestQuery {
  customerRequestId: string
}

export interface IUpdateCustomerRequest{
  query: IFindOneCustomerRequestQuery
  data: IUpdateCustomerRequestData
  user: Credentials
}

export interface IDeleteCustomerRequest {
  query: IFindOneCustomerRequestQuery
  user: Credentials
}

export interface IFindOneCustomerRequest {
  query: IFindOneCustomerRequestQuery
  relations?: string[]
}

export enum CustomerRequestsStatus {
  OPENING = 'OPENING',
  CLOSED = 'CLOSED',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED'
}

interface IFindManyCustomerRequestQuery {
  customerId?: string
  fromDate?: Date
  toDate?: Date
  fromPrice?: number
  toPrice?: number
  status?: CustomerRequestsStatus
  sortBy?: CustomerRequestSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}

export interface IFindManyCustomerRequest {
  query: IFindManyCustomerRequestQuery
}

export interface IFindManyCustomerRequestResult {
  list: CustomerRequests[]
  totalCount: number
}