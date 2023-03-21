import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { checkRole } from "../../middleware/authz";
import { PermissionStatus, RoleName } from "../../modules/permissions/permissions.type";
import { PermissionsService } from "modules/permissions/permissions.service";
import { UsersService } from "modules/users/users.service";

const approveStylist: LambdaFunction = async (
  event,
  context,
): Promise<boolean> => {
  const { user, pathParameters } = event as any
  const usersService = new UsersService()
  const permissionService = new PermissionsService()

  const stylist = await usersService.findOne({
    query: {
      userId: pathParameters.stylistId
    },
    relations: ['permissions']
  })

  const stylistPermission = stylist?.permissions?.find(permission => permission.roleName === RoleName.STYLIST)

  if (!stylistPermission) {
    throw {
      code: 400,
      name: 'InvalidStylist'
    }
  }

  if (stylistPermission.status === PermissionStatus.ACTIVE) {
    throw {
      code: 400,
      name: 'StylistWasApproved',
    }
  }

  await permissionService.updateOne({
    query: { permissionId: stylistPermission.permissionId },
    data: {
      status: PermissionStatus.ACTIVE
    }
  })

  return true
}

export const handler = lambdaFunction({
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.ADMIN])
  ],
  handler: approveStylist
})