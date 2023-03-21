import { LambdaFunction } from "common/types";
import { deleteServiceDto } from "../../modules/services/services.dto";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { PermissionStatus, RoleName } from "../../modules/permissions/permissions.type";
import { ServicesServices } from "../../modules/services/services.service";

const deleteService: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const { user, pathParameters } = event;
  const servicesService = new ServicesServices();

  return await servicesService.deleteService({
    query: {
      serviceId: pathParameters.serviceId,
    },
    user,
  });
};

export const handler = lambdaFunction({
  schema: deleteServiceDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([{ roleName: RoleName.STYLIST, status: [PermissionStatus.ACTIVE, PermissionStatus.PENDING]}]),
  ],
  handler: deleteService,
});
