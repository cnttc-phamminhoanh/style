import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { updateProposalServiceDto } from "../../modules/proposalsServices/proposalsServices.dto";
import { ProposalsServicesService } from "../../modules/proposalsServices/proposalsServices.service";
import { ProposalsServices } from "../../modules/proposals/proposals.service";
import { ProposalsStatus } from "../../modules/proposals/proposals.type";

const updateProposalService: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const { user, body, pathParameters } = event as any
  const proposalsServicesService = new ProposalsServicesService()
  const proposalsServices = new ProposalsServices()

  const proposalService = await proposalsServicesService.findOneProposalService({
    query: { proposalServiceId: pathParameters.proposalServiceId },
    user
  })

  const proposal = await proposalsServices.findOneProposal({
    query: {
      proposalId: proposalService.proposalId,
    },
    user
  })

  if (proposal.status !== ProposalsStatus.PENDING) {
    throw {
      code: 400,
      name: `Proposal was ${proposal.status.toLowerCase()}`
    }
  }

  return await proposalsServicesService.updateProposalService({
    query: { proposalServiceId: proposalService.proposalServiceId },
    data: { price: body.price }
  })
};

export const handler = lambdaFunction({
  schema: updateProposalServiceDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: updateProposalService,
});
