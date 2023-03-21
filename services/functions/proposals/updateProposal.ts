import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { ProposalsServices } from "../../modules/proposals/proposals.service";
import { updateProposalDto } from "../../modules/proposals/proposals.dto";
import { CustomerRequestsService } from "../../modules/customerRequests/customerRequests.service";
import { CustomerRequestsStatus } from "../../modules/customerRequests/customerRequests.type";

const updateProposal: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const { user, body, pathParameters } = event as any
  const proposalsServices = new ProposalsServices()
  const customerRequestsService = new CustomerRequestsService()

  const customerRequest = await customerRequestsService.findOne({
    query: { customerRequestId: body.customerRequestId }
  });

  if (customerRequest?.status !== CustomerRequestsStatus.OPENING) {
    throw {
      code: 400,
      name: `Customer was ${customerRequest.status.toLowerCase()}`,
    };
  }

  return await proposalsServices.updateProposal({
    query: { proposalId: pathParameters.proposalId },
    data: body,
    user
  })
};

export const handler = lambdaFunction({
  schema: updateProposalDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: updateProposal,
});
