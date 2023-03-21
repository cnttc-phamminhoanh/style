import { LambdaFunction } from "common/types";
import { UsersSchedule } from "../../modules/usersSchedule/usersSchedule.entity";
import { UsersScheduleService } from "../../modules/usersSchedule/usersSchedule.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { createUsersScheduleDto } from "../../modules/usersSchedule/usersSchedule.dto";
import { checkRole } from "../../middleware/authz";
import { RoleName, PermissionStatus } from "../../modules/permissions/permissions.type";

const createUserSchedule: LambdaFunction = async (
  event,
  context,
): Promise<UsersSchedule> => {
  const { user, body } = event as any

  const usersScheduleService = new UsersScheduleService()

  const userSchedule = await usersScheduleService.findOneUsersSchedule({
    query: {
      userId: user.userId,
    },
    checkExist: false,
  })

  if (userSchedule) {
    throw {
      code: 400,
      name: 'UserScheduleAlreadyExists',
    }
  }

  const newUserSchedule = await usersScheduleService.createUsersSchedule({
    data: {
      ...body,
      userId: user.userId,
    }
  })

  return newUserSchedule
}

export const handler = lambdaFunction({
  schema: createUsersScheduleDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([{ roleName: RoleName.STYLIST, status: [PermissionStatus.PENDING, PermissionStatus.ACTIVE] }])
  ],
  handler: createUserSchedule
})