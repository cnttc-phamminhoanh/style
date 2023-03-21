import { Credentials, SortDirection } from "common/types";
import { Services } from "modules/services/services.entity"
import { ProposalsServices } from "./proposalsServices.entity";

interface ICreateProposalsServicesData {
  customerId: string
  proposalId: string
  services: Services[]
}

export interface ICreateProposalsServicesService {
  data: ICreateProposalsServicesData;
}

interface IErrorService {
  serviceId: string
  error: string
}

export interface IValidateServicesResult {
  services: Services[]
  errors: IErrorService[]
}

interface IUpdateProposalsServicesData {
  price: number
}

interface IUpdateProposalsServicesQuery {
  proposalServiceId: string
}


export interface IUpdateProposalsServicesService {
  data: IUpdateProposalsServicesData
  query: IUpdateProposalsServicesQuery
}

export interface IFindOneProposalServiceService {
  query: IUpdateProposalsServicesQuery
  user: Credentials
}

interface ICreateProposalServiceData {
  stylistId: string
  customerId: string
  proposalId: string
  serviceId: string
  price: number
}

export interface ICreateProposalServiceServices {
  data: ICreateProposalServiceData
}

interface IDeleteProposalServiceQuery {
  proposalServiceId: string
}

export interface IDeleteProposalServiceService {
  query: IDeleteProposalServiceQuery
  user: Credentials
}

export enum ProposalServiceSortBy {
  PROPOSALSERVICEID = 'proposalServiceId',
  STYLISTID = 'stylistId',
  CUSTOMERID = 'customerId',
  SERVICEID = 'serviceId',
  PROPOSALID = 'proposalId',
  PRICE = 'price',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}
interface IFindManyProposalServicesQuery {
  proposalServiceId?: string
  stylistId?: string
  customerId?: string
  serviceId?: string
  fromPrice: number
  toPrice: number
  sortBy?: ProposalServiceSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}

export interface IFindManyProposalServicesService {
  query: IFindManyProposalServicesQuery
  user: Credentials
}

export interface IFindManyProposalServicesResult {
  list: ProposalsServices[]
  totalCount: number
}