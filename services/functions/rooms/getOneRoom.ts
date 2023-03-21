import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { RoomsService } from "../../modules/rooms/rooms.service";
import { Rooms } from "../../modules/rooms/rooms.entity";
import { getOneRoomDto } from "../../modules/rooms/rooms.dto";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";

const getOneRoom: LambdaFunction = async (
  event,
  context,
): Promise<Rooms> => {
  const { user, pathParameters } = event
  const roomsServices = new RoomsService()

  const room = await roomsServices.findOneRoom({
    query: {
      roomId: pathParameters.roomId
    },
    relations: ['roomMembers'],
    credentials: user
  })

  return room
}

export const handler = lambdaFunction({
  schema: getOneRoomDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],

  handler: getOneRoom
})