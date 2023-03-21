import { LambdaFunction } from "common/types";
import { lambdaFunction } from "core/lambda";
import { Auth } from "middleware/auth";
import { checkRole } from "middleware/authz";
import { getAllCustomerRequestDto } from "modules/customerRequests/customerRequests.dto";
import { CustomerRequestsService } from "modules/customerRequests/customerRequests.service";
import { IFindManyCustomerRequestResult } from "modules/customerRequests/customerRequests.type";
import { RoleName } from "modules/permissions/permissions.type";

const getAllCustomerRequest: LambdaFunction = async (
  event,
  context,
): Promise<IFindManyCustomerRequestResult> => {
  const customerRequestsService = new CustomerRequestsService()

  return await customerRequestsService.findMany({
    query: event.queryStringParameters
  })
}

export const handler = lambdaFunction({
  schema: getAllCustomerRequestDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER])
  ],
  handler: getAllCustomerRequest
})