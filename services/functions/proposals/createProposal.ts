import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { Proposals } from "../../modules/proposals/proposals.entity";
import { ProposalsServices } from "../../modules/proposals/proposals.service";
import { CustomerRequestsService } from "../../modules/customerRequests/customerRequests.service";
import { CustomerRequestsStatus } from "../../modules/customerRequests/customerRequests.type";
import { createProposalDto } from "../../modules/proposals/proposals.dto";
import { StylistsServices } from "../../modules/stylists/stylists.service";
import { ProposalsServicesService } from "../../modules/proposalsServices/proposalsServices.service";
import { validateServices } from "../../modules/proposalsServices/helper";


const createProposal: LambdaFunction = async (
  event,
  context
): Promise<Proposals> => {
  const { user, body } = event as any;
  const stylistId = user.userId as string;
  const proposalsServices = new ProposalsServices();
  const customerRequestsService = new CustomerRequestsService();
  const stylistsServices = new StylistsServices();
  const proposalsServicesService = new ProposalsServicesService();

  const stylist = await stylistsServices.getOrCreateOneStylist({
    query: { stylistId },
    relations: [
      'services'
    ]
  })

  if (!stylist?.services?.length) {
    throw {
      code: 400,
      name: "Stylist does not have any service",
    };
  }

  const customerRequest = await customerRequestsService.findOne({
    query: { customerRequestId: body.customerRequestId },
    relations: ["proposals"],
  });

  if (customerRequest.status !== CustomerRequestsStatus.OPENING) {
    throw {
      code: 400,
      name: `Customer's request was ${customerRequest.status.toLowerCase()}`,
    };
  }

  const hasSentProposal = customerRequest.proposals.find(proposal => proposal.stylistId === stylistId)

  if (hasSentProposal) {
    throw {
      code: 400,
      name: "You have sent a proposal to this customer's request",
    };
  }

  const stylistServices = stylist.services
  const { services, errors } = await validateServices(body.services, stylistServices);

  if (errors?.length) {

    throw {
      code: 400,
      name: 'InvalidServices',
      message: errors,
    }
  }

  const newProposal = await proposalsServices.createProposal({
    data: {
      customerRequestId: body.customerRequestId,
      message: body.message,
      images: body?.images,
      stylistId,
      createdBy: user.userId,
      customerId: customerRequest.customerId,
    },
  });

  const newProposalServices = await proposalsServicesService.createProposalsServices({
    data: {
      services,
      customerId: customerRequest.customerId,
      proposalId: newProposal.proposalId,
    },
  });

  newProposal.proposalServices = newProposalServices

  return newProposal;
};

export const handler = lambdaFunction({
  schema: createProposalDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: createProposal,
});
