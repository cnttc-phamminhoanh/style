import { Credentials, SortDirection } from "common/types"
import { CustomerRequests } from "modules/customerRequests/customerRequests.entity"
import { Users } from "modules/users/users.entity"
import { Proposals } from "./proposals.entity"

export enum ProposalsStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED'
}

export interface ICreateProposalsServices {
  serviceId: string
  price?: number
}
interface ICreateProposalsData {
  customerRequestId: string
  message: string
  images?: string[]
  stylistId: string
  createdBy: string
  customerId: string
}

export interface ICreateProposalsService {
  data: ICreateProposalsData
}

export interface ICheckStylistSuggested {
  customerRequest: CustomerRequests
  stylistId: string
}

interface IFindOneProposalParam {
  proposalId: string
}

interface IUpdateProposalData {
  message?: string
  images?: string[]
  status?: ProposalsStatus
}

export interface IUpdateProposalService {
  query: IFindOneProposalParam
  data: IUpdateProposalData
  user: Credentials | Users
}

export interface IDeleteProposalService {
  query: IFindOneProposalParam
  user: Credentials | Users
}

export interface IFindOneProposalService {
  query: IFindOneProposalParam
  relations?: string[]
  user?: Credentials | Users
}


export enum ProposalsSortBy {
  PROPOSALID = 'proposalId',
  CUSTOMERREQUESTID = 'customerRequestId',
  STYLISTID = 'stylistId',
  CUSTOMERID = 'customerId',
  CREATEDBY = 'createdBy',
  MESSAGE = 'message',
  IMAGES = 'images',
  STATUS = 'status',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

interface IFindManyProposalsQuery {
  customerRequestId?: string
  stylistId?: string
  customerId?: string
  message?: string
  status?: ProposalsStatus
  sortBy?: ProposalsSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}

export interface IFindManyProposalsService {
  query: IFindManyProposalsQuery
  user: Credentials | Users
  relations: string[]
}

export interface IFindManyProposalsResult {
  list: Proposals[]
  totalCount: number
}