import { ConnectedAccountService } from "modules/connectedAccounts/connectedAccounts.service";
import { ConnectedAccountsStatus } from "modules/connectedAccounts/connectedAccounts.type";
import { PaymentMethodsService } from "modules/paymentMethods/paymentMethods.service";
import { PaymentsService } from "modules/payments/payments.service";
import { PaymentStatus } from "modules/payments/payments.type";
import { AppointmentsServices } from "./appointments.service"
import { AppointMentRelations, IValidateAppointmentPaymentResult } from "./appointments.type";

export class AppointmentCombinedService {
  private readonly appointmentsService: AppointmentsServices
  private readonly connectedAccountsService: ConnectedAccountService
  private readonly paymentMethodsService: PaymentMethodsService

  constructor() {
    this.appointmentsService = new AppointmentsServices()
    this.connectedAccountsService = new ConnectedAccountService()
    this.paymentMethodsService = new PaymentMethodsService()
  }

  async validateAppointmentPayment({
    appointmentId,
    paymentMethodId,
    credentials
  }): Promise<IValidateAppointmentPaymentResult> {
    const appointment = await this.appointmentsService.findOneAppointment({
      query: {
        appointmentId
      },
      relations: [
        AppointMentRelations.services,
        AppointMentRelations.payments,
      ]
    })

    if (appointment.payments?.length) {
      const shouldRejectThisPayment = appointment.payments.some(payment => {
        // todo: need to calculate the total processed amount of the appointment in case partial payment
        return payment.status === PaymentStatus.PAID || payment.status === PaymentStatus.PENDING
      })

      if (shouldRejectThisPayment) {
        throw {
          code: 400,
          name: `Appointment payment has been processed`
        }
      }
    }

    const [connectedAccount, paymentMethod] = await Promise.all([
      this.connectedAccountsService.findOneConnectedAccount({
        query: {
          stylistId: appointment.stylistId
        }
      }),
      this.paymentMethodsService.findOnePaymentMethod({
        query: {
          paymentMethodId,
          customerId: appointment.customerId as string,
        },
        credentials
      })
    ])

    if (connectedAccount.status !== ConnectedAccountsStatus.ACTIVE) {
      throw {
        code: 400,
        name: 'ConnectAccountIsNotActive'
      }
    }

    let appointmentAmount = 0

    appointment.services?.forEach(appointmentService => {
      appointmentAmount += appointmentService.price
    })

    return {
      amount: appointmentAmount,
      customerId: appointment.customerId as string,
      stylistId: appointment.stylistId as string,
      connectedAccount,
      paymentMethod,
    }
  }
}