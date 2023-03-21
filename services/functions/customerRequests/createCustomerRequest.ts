import { LambdaFunction } from "common/types";
import { lambdaFunction } from "core/lambda";
import { Auth } from "middleware/auth";
import { checkRole } from "middleware/authz";
import { createCustomerRequestDto } from "modules/customerRequests/customerRequests.dto";
import { CustomerRequests } from "modules/customerRequests/customerRequests.entity";
import { CustomerRequestsService } from "modules/customerRequests/customerRequests.service";
import { CustomersService } from "modules/customers/customers.service";
import { RoleName } from "modules/permissions/permissions.type";
import { Users } from "modules/users/users.entity";

const createCustomerRequest: LambdaFunction = async (
  event,
  context,
): Promise<CustomerRequests> => {
  const user = event.user as Users
  const customerRequestService = new CustomerRequestsService()
  const customerService = new CustomersService()

  const existedCustomer = await customerService.getOrCreateOneCustomer(user.userId)

  return await customerRequestService.create({
    data: {
      ...event.body as any,
      customerId: existedCustomer.customerId
    }
  })
}

export const handler = lambdaFunction({
  schema: createCustomerRequestDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER])
  ],
  handler: createCustomerRequest
})