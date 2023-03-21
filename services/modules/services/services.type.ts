import { Stylists } from "../../modules/stylists/stylists.entity"
import { Services as ServicesEntity } from "../../modules/services/services.entity"
import { Credentials, SortDirection } from "common/types"


export enum ServiceStatus {
  ENABLE = 'ENABLE',
  UNABLE = 'UNABLE'
}

export enum Services {
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
}

interface IService {
  serviceId?: string
  stylistId?: string
  serviceName: string
  price: number
  status: ServiceStatus
}

interface ICreateServiceData {
  services: IService[]
  stylistId: string
}

export interface ICreateServiceService {
  data: ICreateServiceData
}

interface IUpdateManyServiceData {
  services?: ServicesEntity[]
  stylist?: Stylists
}

export interface IUpdateManyServiceService {
  data: IUpdateManyServiceData
}

export interface ICreateOneServiceService {
  data: IService
}

interface IFindOneServiceQuery {
  serviceId : string
}

export interface IFindOneServiceService {
  query: IFindOneServiceQuery
}

export enum ServicesSortBy {
  SERVICEID = 'serviceId',
  STYLISTID = 'stylistId',
  SERVICENAME = 'serviceName',
  PRICE = 'price',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

interface IFindManyServicesQuery {
  serviceId?: string
  stylistId?: string
  serviceName?: string
  price?: number
  status?: ServiceStatus
  sortBy?: ServicesSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}


export interface IFindManyServicesService {
  query: IFindManyServicesQuery
}

export interface IFindManyServicesResult {
  list: ServicesEntity[]
  totalCount: number
}

interface IUpdateOneServiceData{
  price?: number
  status?: ServiceStatus
}

interface IUpdateOneServiceQuery{
  serviceId: string
}

export interface IUpdateOneServiceService {
  query: IUpdateOneServiceQuery
  data: IUpdateOneServiceData
  user?: Credentials
}

interface IDeleteServiceData {
  serviceId: string
}

export interface IDeleteServiceService {
  query: IDeleteServiceData
  user: Credentials
}

interface IFindManyServiceQuery {
  serviceIds : string[]
}

export interface IFindManyServiceService {
  query: IFindManyServiceQuery
}
