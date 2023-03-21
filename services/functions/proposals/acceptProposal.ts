import { LambdaFunction } from "common/types";
import { ProposalsServices } from "../../modules/proposals/proposals.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { acceptProposalDto } from "../../modules/proposals/proposals.dto";
import { ProposalsStatus } from "../../modules/proposals/proposals.type";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { AppointmentsServices } from "modules/appointments/appointments.service";
import { AppointmentServicesService } from "modules/appointmentServices/appointmentServices.service";
import { CustomerRequests } from "modules/customerRequests/customerRequests.entity";
import { Appointments } from "modules/appointments/appointments.entity";
import { ServicesServices } from "modules/services/services.service";
import { CustomerRequestsStatus } from "modules/customerRequests/customerRequests.type";

const acceptProposal: LambdaFunction = async (
  event,
  context
): Promise<Appointments> => {
  const { user, pathParameters } = event;
  const proposalsServices = new ProposalsServices();
  const appointmentsServices = new AppointmentsServices();
  const servicesService = new ServicesServices();
  const appointmentServicesService = new AppointmentServicesService();
  let notes = []

  const proposal = await proposalsServices.findOneProposal({
    query: {
      proposalId: pathParameters.proposalId,
    },
    relations: ['proposalServices', 'customerRequestId'],
    user
  })

  const customerRequest = proposal.customerRequestId as unknown as CustomerRequests

  if (customerRequest.status !== CustomerRequestsStatus.OPENING) {
    throw {
      code: 400,
      name: `CustomerRequestAlready${customerRequest.status}`
    }
  }

  if (proposal.status !== ProposalsStatus.PENDING) {
    throw {
      code: 400,
      name: `ProposalAlready${proposal.status}`
    }
  }

  if (proposal.stylistId === user.userId) {
    throw {
      code: 400,
      name: 'InvalidStylistID'
    }
  }

  const isAppointmentExists = await appointmentsServices.checkAppointmentExists({
    query: {
      time: customerRequest.time ,
      stylistId: proposal.stylistId,
      customerId: user.userId
    }
  })

  if (isAppointmentExists) {
    throw {
      code: 400,
      name: 'AppointmentAlreadyExists'
    }
  }

  const isConflictTime = await appointmentsServices.checkAppointmentConflict({
    query: {
      time: customerRequest.time,
      stylistId: proposal.stylistId,
      customerId: user.userId
    }
  })

  if (isConflictTime) {
    throw {
      code: 400,
      name: 'AppointmentConflictTime'
    }
  }

  if (!proposal.proposalServices?.length) {
    throw {
      code: 404,
      name: 'ProposalServicesNotFound'
    }
  }

  const serviceIds = proposal.proposalServices.map(proposalsService => {

    return proposalsService.serviceId
  })

  const findServices = await servicesService.findManyWithServiceIds({
    query: { serviceIds }
  })

  if (!findServices.length) {
    throw {
      code: 404,
      name: 'ServicesNotFound',
    }
  }

  const services = findServices.map(service => {
    const proposalService = proposal.proposalServices.find(proposalService => proposalService.serviceId === service.serviceId)

    if (proposalService) {
      notes.push(service.serviceName)
      service.price = proposalService.price

      return service
    }

    return
  })

  await proposalsServices.updateProposal({
    query: {
      proposalId: pathParameters.proposalId,
    },
    data: {
      status: ProposalsStatus.ACCEPTED,
    },
    user
  })

  const newAppointment: Appointments = await appointmentsServices.createAppointment({
    data: {
      time: customerRequest.time,
      notes: notes.join(', '),
      stylistId: proposal.stylistId, 
      customerId: user.userId,
      createdBy: user.userId,
    }
  })

  const newAppointmentServices = await appointmentServicesService.createAppointmentServices({
    data: {
      services,
      appointmentId: newAppointment.appointmentId,
      customerId: user.userId,
      createdBy: user.userId,
    }
  })

  newAppointment.services = newAppointmentServices

  return newAppointment
}

export const handler = lambdaFunction({
  schema: acceptProposalDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER]),
  ],
  handler: acceptProposal,
});
