import { LambdaFunction } from "common/types";
import { UsersSchedule } from "../../modules/usersSchedule/usersSchedule.entity";
import { UsersScheduleService } from "../../modules/usersSchedule/usersSchedule.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { getOneUserScheduleDto } from "modules/usersSchedule/usersSchedule.dto";

const getOneUserSchedule: LambdaFunction = async (
  event,
  context,
): Promise<UsersSchedule> => {
  const { userId } = event.pathParameters

  const usersScheduleService = new UsersScheduleService()

  const userSchedule = await usersScheduleService.findOneUsersSchedule({
    query: {
      userId,
    }
  })

  return userSchedule
}

export const handler = lambdaFunction({
  schema: getOneUserScheduleDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt
  ],
  handler: getOneUserSchedule
})