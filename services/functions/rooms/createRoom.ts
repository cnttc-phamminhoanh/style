import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { checkRole } from '../../middleware/authz';
import { RoleName } from '../../modules/permissions/permissions.type'
import { createRoomDto } from "../../modules/rooms/rooms.dto";
import { RoomsService } from "../../modules/rooms/rooms.service";
import { Rooms } from "../../modules/rooms/rooms.entity";
import { UsersService } from "../../modules/users/users.service";
import { RoomMembersService } from "../../modules/roomMembers/roomMembers.service";
import { validateUserIds } from "../../modules/rooms/helper";

const createRoom: LambdaFunction = async (
  event,
  context,
): Promise<Rooms> => {
  const user = event.user
  const body = event.body as any
  const roomServices = new RoomsService()
  const roomMembersService = new RoomMembersService()
  const userService = new UsersService()

  if (!body.userIds.includes(user.userId) && !user.isAdmin) {
    throw {
      code: 400,
      name: "You do not have insufficient permission to create room for other",
    }
  }

  const users = await userService.findManyByUserIds({
    query: {
      userIds: body.userIds,
    },
  })

  const { userIds, errors } = validateUserIds(body.userIds, users)

  if (errors?.length) {
    throw {
      code: 400,
      name: 'InvalidUserId',
      message: errors
    }
  }

  const existingRooms = await roomServices.getRoomFromUserIds({
    query: {
      userIds
    }
  })

  if (existingRooms?.length) {

    return existingRooms[0]
  }

  const room = await roomServices.createRoom({
    data: {
      createdBy: user.userId,
      name: body.name,
      description: body.description,
    }
  })

  const roomMembers = await roomMembersService.createRoomMembers({
    data: {
      roomId: room.roomId,
      userIds,
    }
  })

  room.roomMembers = roomMembers

  return room
}

export const handler = lambdaFunction({
  schema: createRoomDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: createRoom
})