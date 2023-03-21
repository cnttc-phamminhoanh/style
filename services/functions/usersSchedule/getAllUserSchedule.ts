import { LambdaFunction } from "common/types";
import { UsersScheduleService } from "../../modules/usersSchedule/usersSchedule.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { getAllUserScheduleDto } from "modules/usersSchedule/usersSchedule.dto";
import { IFindManyUserScheduleResult } from "modules/usersSchedule/usersSchedule.type";

const getAllUserSchedule: LambdaFunction = async (
  event,
  context,
): Promise<IFindManyUserScheduleResult> => {

  const { queryStringParameters } = event

  const usersScheduleService = new UsersScheduleService()

  const usersSchedule = await usersScheduleService.findManyUsersSchedule({
    query: {
      ...queryStringParameters,
    }
  })

  return usersSchedule
}

export const handler = lambdaFunction({
  schema: getAllUserScheduleDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt
  ],
  handler: getAllUserSchedule
})