import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { ProposalsServices } from "../../modules/proposals/proposals.service";
import { Proposals } from "../../modules/proposals/proposals.entity";
import { getOneProposalDto } from "../../modules/proposals/proposals.dto";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";

const getOneProposal: LambdaFunction = async (
  event,
  context,
): Promise<Proposals> => {
  const { user, pathParameters } = event
  const proposalsServices = new ProposalsServices()

  const proposal = await proposalsServices.findOneProposal({
    query: {
      proposalId: pathParameters.proposalId
    },
    relations: ['proposalServices'],
    user
  })

  return proposal
}

export const handler = lambdaFunction({
  schema: getOneProposalDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],

  handler: getOneProposal
})