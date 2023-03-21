import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { ProposalsServices } from "../../modules/proposals/proposals.service";
import { deleteProposalDto } from "../../modules/proposals/proposals.dto";

const deleteProposal: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const { user, pathParameters } = event;
  const proposalsServices = new ProposalsServices();

  return await proposalsServices.deleteProposal({
    query: {
      proposalId: pathParameters.proposalId,
    },
    user,
  });
};

export const handler = lambdaFunction({
  schema: deleteProposalDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: deleteProposal,
});
