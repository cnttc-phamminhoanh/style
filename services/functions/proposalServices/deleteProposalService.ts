import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { ProposalsServicesService } from "modules/proposalsServices/proposalsServices.service";
import { deleteProposalServiceDto } from "modules/proposalsServices/proposalsServices.dto";

const deleteProposalService: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const { user, pathParameters } = event;
  const proposalsServicesService = new ProposalsServicesService();

  return await proposalsServicesService.deleteProposalService({
    query: {
      proposalServiceId: pathParameters.proposalServiceId,
    },
    user,
  });
};

export const handler = lambdaFunction({
  schema: deleteProposalServiceDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: deleteProposalService,
});
