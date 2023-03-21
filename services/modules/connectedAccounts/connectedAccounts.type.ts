export enum ConnectedAccountsType {
  STANDARD = 'standard',
  EXPRESS = 'express',
  CUSTOM = 'custom'
}

export enum ConnectedAccountsStatus {
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

interface ICreateConnectedAccountData {
  stylistId: string
  stripeConnectedAccountId: string
  type: ConnectedAccountsType
  status: ConnectedAccountsStatus
}

export interface ICreateConnectedAccountService {
  data: ICreateConnectedAccountData
}

interface ICheckConnectedAccountQuery {
  stylistId: string
}

export interface ICheckConnectedAccountService {
  query: ICheckConnectedAccountQuery
}

export interface ICheckConnectedAccountResult {
  hasConnectedAccount: boolean
  status: ConnectedAccountsStatus
}

export interface ICreateConnectAccountLinkResult{
  connectAccountLink: string
}

interface IUpdateConnectedAccountQuery {
  stylistId: string
}

interface IUpdateConnectedAccountData {
  type?: ConnectedAccountsType
  status?: ConnectedAccountsStatus
  stripeConnectedAccountId?: string
}

export interface IUpdateConnectedAccountService {
  query: IUpdateConnectedAccountQuery
  data: IUpdateConnectedAccountData
}

interface IFindOneConnectedAccountQuery {
  stylistId: string
}

export interface IFindOneConnectedAccountService {
  query: IFindOneConnectedAccountQuery
}
