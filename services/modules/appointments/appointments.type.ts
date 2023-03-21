import { Credentials, SortDirection } from "common/types"
import { ConnectedAccounts } from "modules/connectedAccounts/connectedAccounts.entity"
import { PaymentMethods } from "modules/paymentMethods/paymentMethods.entity"

export enum AppointmentStatus {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
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
  SCALP_MESSAGE = 'scalpMessage'
}

interface ICreateAppointmentData {
  stylistId: string
  customerId: string
  createdBy: string
  time: Date
  notes: string
}

interface CheckAppointmentConflictQuery {
  time: Date
  stylistId: string
  customerId: string
}

export interface ICreateAppointmentService {
  data: ICreateAppointmentData
}

export interface CheckAppointmentConflictService {
  query: CheckAppointmentConflictQuery
}

export enum Tab {
  PASS = 'PASS',
  UPCOMING = 'UPCOMING',
}

export enum AppointmentsSortBy {
  appointmentId = 'appointmentId',
  stylistId = 'stylistId',
  customerId = 'customerId',
  createdBy = 'createdBy',
  status = 'status',
  time = 'time',
  notes = 'notes',
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export enum AppointMentRelations {
  stylistId = 'stylistId',
  customerId = 'customerId',
  services = 'services',
  createdBy = 'createdBy',
  payments = 'payments'
}

interface IFindManyAppointmentsQuery {
  stylistId?: string
  customerId?: string
  createdBy?: string
  tab?: Tab
  sortBy?: AppointmentsSortBy
  sortDirection?: SortDirection
  limit?: number
  offset?: number
}

export interface IFindManyAppointmentsService {
  query: IFindManyAppointmentsQuery
  user: Credentials,
  relations: string [],
}

type Data = { [key: string]: any }

export interface IFindManyAppointmentsResult {
  list: Data[]
  totalCount: number
}


interface IFindOneAppointmentParam {
  appointmentId: string
}

interface IUpdateAppointmentData {
  status?: AppointmentStatus
  time?: Date
  notes?: string
}

export interface IUpdateAppointmentService {
  query: IFindOneAppointmentParam
  data: IUpdateAppointmentData
}

interface IFindOneAppointmentQuery {
  appointmentId: string
}

export interface IFindOneAppointmentService {
  query: IFindOneAppointmentQuery
  relations?: AppointMentRelations[]
  checkExist?: boolean
}

interface CheckAppointmentExistsQuery {
  time: Date
  stylistId: string
  customerId: string
}

export interface CheckAppointmentExistsService {
  query: CheckAppointmentExistsQuery
}

export interface IValidateAppointmentPaymentProps {
  appointmentId: string
  paymentMethodId: string
  credentials: Credentials
}

export interface IValidateAppointmentPaymentResult {
  amount: number
  customerId: string
  stylistId: string
  connectedAccount: ConnectedAccounts
  paymentMethod: PaymentMethods
}