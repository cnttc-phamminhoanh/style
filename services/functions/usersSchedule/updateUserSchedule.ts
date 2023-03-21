import { LambdaFunction } from "common/types";
import { UsersScheduleService } from "../../modules/usersSchedule/usersSchedule.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { updateUsersScheduleDto } from "../../modules/usersSchedule/usersSchedule.dto";
import { checkRole } from "../../middleware/authz";
import { RoleName, PermissionStatus } from "../../modules/permissions/permissions.type";

const updateUserSchedule: LambdaFunction = async (
  event,
  context,
): Promise<boolean> => {
  const { user, body } = event as any

  const usersScheduleService = new UsersScheduleService()

  const isUpdated = await usersScheduleService.updateUsersSchedule({
    query: {
      userId: user.userId,
    },
    data: body,
  })

  return isUpdated
}

export const handler = lambdaFunction({
  schema: updateUsersScheduleDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([{ roleName: RoleName.STYLIST, status: [PermissionStatus.ACTIVE, PermissionStatus.PENDING] }])
  ],
  handler: updateUserSchedule
})