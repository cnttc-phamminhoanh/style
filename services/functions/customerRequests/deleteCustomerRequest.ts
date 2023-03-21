import { LambdaFunction } from "common/types";
import { lambdaFunction } from "core/lambda";
import { Auth } from "middleware/auth";
import { checkRole } from "middleware/authz";
import { deleteCustomerRequestDto } from "modules/customerRequests/customerRequests.dto";
import { CustomerRequestsService } from "modules/customerRequests/customerRequests.service";
import { RoleName } from "modules/permissions/permissions.type";

const deleteCustomerRequest: LambdaFunction = async (
  event,
  context,
): Promise<boolean> => {
  const customerRequestsService = new CustomerRequestsService()

  return customerRequestsService.delete({
    query: event.pathParameters as any,
    user: event.user
  })
}

export const handler = lambdaFunction({
  schema: deleteCustomerRequestDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER])
  ],
  handler: deleteCustomerRequest
})