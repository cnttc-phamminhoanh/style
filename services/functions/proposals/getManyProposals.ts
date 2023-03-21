import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { ProposalsServices } from "../../modules/proposals/proposals.service";
import { getManyProposalsDto } from "../../modules/proposals/proposals.dto";
import { IFindManyProposalsResult } from "../../modules/proposals/proposals.type";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";

const getManyProposals: LambdaFunction = async (
  event,
  context,
): Promise<IFindManyProposalsResult> => {
  const { user, queryStringParameters } = event
  const proposalsServices = new ProposalsServices()

  const proposals = await proposalsServices.findManyProposals({
    query: { ...queryStringParameters },
    relations: ['proposalServices'],
    user
  })

  return proposals
}

export const handler = lambdaFunction({
  schema: getManyProposalsDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: getManyProposals
})