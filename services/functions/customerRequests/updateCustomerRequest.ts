import { LambdaFunction } from "common/types";
import { lambdaFunction } from "core/lambda";
import { Auth } from "middleware/auth";
import { checkRole } from "middleware/authz";
import { updateCustomerRequestDto } from "modules/customerRequests/customerRequests.dto";
import { CustomerRequests } from "modules/customerRequests/customerRequests.entity";
import { CustomerRequestsService } from "modules/customerRequests/customerRequests.service";
import { RoleName } from "modules/permissions/permissions.type";

const updateCustomerRequest: LambdaFunction = async (
  event,
  context,
): Promise<CustomerRequests> => {
  const customerRequestService = new CustomerRequestsService()

  return await customerRequestService.update({
    data: event.body as any,
    query: event.pathParameters as any,
    user: event.user
  })
}

export const handler = lambdaFunction({
  schema: updateCustomerRequestDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER])
  ],
  handler: updateCustomerRequest
})