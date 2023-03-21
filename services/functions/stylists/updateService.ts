import { LambdaFunction } from "common/types";
import { updateOneServiceDto } from "../../modules/services/services.dto";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { checkRole } from "../../middleware/authz";
import { PermissionStatus, RoleName } from "../../modules/permissions/permissions.type";
import { ServicesServices } from "../../modules/services/services.service";

const updateServices: LambdaFunction = async (
  event,
  context,
): Promise<boolean> => {
  const { user, body, pathParameters } = event as any
  const servicesService = new ServicesServices()

  const service = await servicesService.updateOneService({
    query: {
      serviceId: pathParameters.serviceId
    },
    data: body,
    user
  })

  return service
}

export const handler = lambdaFunction({
  schema: updateOneServiceDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([{ roleName: RoleName.STYLIST, status: [PermissionStatus.ACTIVE, PermissionStatus.PENDING] }])
  ],
  handler: updateServices
})