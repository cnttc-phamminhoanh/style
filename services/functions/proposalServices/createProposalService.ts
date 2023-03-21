import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { ProposalsServices } from "../../modules/proposals/proposals.service";
import { ProposalsServices as ProposalsServicesEntity } from "../../modules/proposalsServices/proposalsServices.entity";
import { StylistsServices } from "../../modules/stylists/stylists.service";
import { ProposalsServicesService } from "../../modules/proposalsServices/proposalsServices.service";
import { createProposalServiceDto } from "modules/proposalsServices/proposalsServices.dto";
import { ProposalsStatus } from "modules/proposals/proposals.type";
import { ServiceStatus } from "modules/services/services.type";


const createProposalService: LambdaFunction = async (
  event,
  context
): Promise<ProposalsServicesEntity> => {
  const { user, body } = event as any;
  const stylistId = user.userId as string;
  const proposalsServices = new ProposalsServices();
  const stylistsServices = new StylistsServices();
  const proposalsServicesService = new ProposalsServicesService();

  const proposal = await proposalsServices.findOneProposal({
    query: {
      proposalId: body.proposalId
    },
    relations: ['proposalServices'],
    user
  })

  if (proposal.status !== ProposalsStatus.PENDING) {
    throw {
      code: 400,
      name: `Proposal was ${proposal.status.toLowerCase()}`,
    };
  }

  if (proposal?.proposalServices?.length) {
    const hasProposalService = proposal?.proposalServices?.find(proposalService => proposalService.serviceId === body?.serviceId)

    if (hasProposalService) {
      throw {
        code: 400,
        name: 'ServiceAlreadyExistsThisProposal',
      };
    }
  }

  const stylist = await stylistsServices.getOrCreateOneStylist({
    query: { stylistId },
    relations: [
      'services'
    ]
  })

  if (!stylist?.services?.length) {
    throw {
      code: 400,
      name: 'Stylist does not have any service',
    };
  }

  const hasExistsService = stylist?.services?.find(service => service.serviceId === body?.serviceId)

  if (!hasExistsService) {
    throw {
      code: 400,
      name: 'Stylist does not have this service',
    };
  }

  if (hasExistsService.status === ServiceStatus.UNABLE) {
    throw {
      code: 400,
      name: 'ThisServiceUnable',
    };
  }

  const newProposalService = await proposalsServicesService.createOneProposalService({
    data: {
      stylistId: proposal.stylistId,
      customerId: proposal.customerId,
      serviceId: body.serviceId,
      proposalId: body.proposalId,
      price: body.price
    },
  })

  return newProposalService;
};

export const handler = lambdaFunction({
  schema: createProposalServiceDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: createProposalService,
});
