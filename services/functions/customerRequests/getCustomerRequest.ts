import { LambdaFunction } from "common/types";
import { lambdaFunction } from "core/lambda";
import { Auth } from "middleware/auth";
import { checkRole } from "middleware/authz";
import { getCustomerRequestDto } from "modules/customerRequests/customerRequests.dto";
import { CustomerRequests } from "modules/customerRequests/customerRequests.entity";
import { CustomerRequestsService } from "modules/customerRequests/customerRequests.service";
import { RoleName } from "modules/permissions/permissions.type";

const getCustomerRequest: LambdaFunction = async (
  event,
  context,
): Promise<CustomerRequests> => {
  const customerRequestsService = new CustomerRequestsService()
  const customerRequest =  await customerRequestsService.findOne({
    query: event.pathParameters as any,
  })

  return customerRequest
}

export const handler = lambdaFunction({
  schema: getCustomerRequestDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER])
  ],
  handler: getCustomerRequest
})