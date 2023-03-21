import { UsersPricing } from './usersPricing/usersPricing.entity'
import { Users } from './users/users.entity'
import { UsersSchedule } from './usersSchedule/usersSchedule.entity'
import { Appointments } from './appointments/appointments.entity'
import { AppointmentServices } from './appointmentServices/appointmentServices.entity'
import { Permissions } from './permissions/permissions.entity'
import { Stylists } from './stylists/stylists.entity'
import { Services } from './services/services.entity'
import { Customers } from './customers/customers.entity'
import { CustomerRequests } from './customerRequests/customerRequests.entity'
import { Proposals } from './proposals/proposals.entity'
import { ProposalsServices } from './proposalsServices/proposalsServices.entity'
import { Rooms } from './rooms/rooms.entity'
import { RoomMembers } from './roomMembers/roomMembers.entity'
import { Payments } from './payments/payments.entity'
import { Transactions } from './transactions/transactions.entity'
import { TransactionLogs } from './transactionLogs/transactionLogs.entity'
import { ConnectedAccounts } from './connectedAccounts/connectedAccounts.entity'
import { PaymentMethods } from './paymentMethods/paymentMethods.entity'

export const entities = [
  Users,
  UsersPricing,
  UsersSchedule,
  Appointments,
  AppointmentServices,
  Permissions,
  Stylists,
  Services,
  Customers,
  CustomerRequests,
  Proposals,
  ProposalsServices,
  Rooms,
  RoomMembers,
  Payments,
  PaymentMethods,
  ConnectedAccounts,
  Transactions,
  TransactionLogs
]