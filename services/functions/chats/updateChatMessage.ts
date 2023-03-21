import { LambdaFunction } from "common/types";
import { lambdaFunction } from "core/lambda";
import { Auth } from "middleware/auth";
import { checkRole } from "middleware/authz";
import { updateChatMessageDto } from "../../modules/chats/chats.dto";
import { ChatsService } from "../../modules/chats/chats.service";
import { RoleName } from "../../modules/permissions/permissions.type";
import { RoomsService } from "../../modules/rooms/rooms.service";
import { RoomStatus } from "../../modules/rooms/rooms.type";

const updateChatMessage: LambdaFunction = async (
  event,
  context,
): Promise<boolean> => {
  const { body, pathParameters } = event as any
  const user = event.user
  const chatsService = new ChatsService()
  const roomsService = new RoomsService()

  const room = await roomsService.findOneRoom({
    query: {
      roomId: pathParameters.roomId,
    },
    relations: ['roomMembers'],
    credentials: user
  })

  if (room.status === RoomStatus.INACTIVE) {
    throw {
      code: 400,
      name: 'This room was inactive'
    }
  }

  return await chatsService.updateChatMessage({
    query: {
      roomId: pathParameters.roomId,
      messageId: pathParameters.messageId
    },
    data: {
      ...body
    },
    credentials: user
  })
}

export const handler = lambdaFunction({
  schema: updateChatMessageDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: updateChatMessage
})