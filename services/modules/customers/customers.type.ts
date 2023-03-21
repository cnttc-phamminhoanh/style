export interface ICreateCustomerData {
  data: {
    customerId: string
    maximumDistance?: number
    hairType?: string
    preferredStyle?: string
    stripeCustomerId?: string
  }
}

interface IUpdateCustomerData {
  maximumDistance?: number
  hairType?: string
  preferredStyle?: string
  stripeCustomerId?: string
}

interface IUpdateCustomerQuery {
  customerId: string
}

export interface IUpdateCustomerService {
  data: IUpdateCustomerData
  query: IUpdateCustomerQuery
}

interface IFindOneCustomerQuery {
  customerId: string
}

export interface IFindOneCustomerService {
  query: IFindOneCustomerQuery
}

export interface ICustomerSignUpResult {
  accessToken: string
}