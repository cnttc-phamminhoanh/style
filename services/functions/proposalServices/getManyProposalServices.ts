import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { getManyProposalServicesDto } from "modules/proposalsServices/proposalsServices.dto";
import { ProposalsServicesService } from "modules/proposalsServices/proposalsServices.service";
import { IFindManyProposalServicesResult } from "modules/proposalsServices/proposalsServices.type";

const getManyProposalServices: LambdaFunction = async (
  event,
  context,
): Promise<IFindManyProposalServicesResult> => {
  const { user, queryStringParameters } = event as any
  const proposalServicesService = new ProposalsServicesService()

  const proposalServices = await proposalServicesService.findManyProposalServices({
    query: { ...queryStringParameters },
    user
  })

  return proposalServices
}

export const handler = lambdaFunction({
  schema: getManyProposalServicesDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: getManyProposalServices
})