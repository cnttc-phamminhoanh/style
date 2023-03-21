import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { RoomsService } from "../../modules/rooms/rooms.service";
import { getManyRoomsDto } from "../../modules/rooms/rooms.dto";
import { IFindManyRoomsResult } from "../../modules/rooms/rooms.type";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";

const getManyRooms: LambdaFunction = async (
  event,
  context,
): Promise<IFindManyRoomsResult> => {
  const { user, queryStringParameters } = event
  const roomsServices = new RoomsService()

  const rooms = await roomsServices.findManyRooms({
    query: { ...queryStringParameters },
    relations: ['roomMembers'],
    credentials: user
  })

  return rooms
}

export const handler = lambdaFunction({
  schema: getManyRoomsDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: getManyRooms
})