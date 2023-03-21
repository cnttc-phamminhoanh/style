import { LambdaFunction } from "common/types";
import { lambdaFunction } from "core/lambda";
import { Auth } from "middleware/auth";
import { checkRole } from "middleware/authz";
import { getListChatMessagesDto } from "../../modules/chats/chats.dto";
import { ChatsService } from "../../modules/chats/chats.service";
import { IFindManyChatMessagesResult } from "../../modules/firebases/firebases.type";
import { RoleName } from "../../modules/permissions/permissions.type";
import { RoomsService } from "../../modules/rooms/rooms.service";
import { RoomStatus } from "../../modules/rooms/rooms.type";

const getListChatMessages: LambdaFunction = async (
  event,
  context,
): Promise<IFindManyChatMessagesResult> => {
  const { pathParameters, queryStringParameters } = event as any
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

  return await chatsService.findManyMessagesInChatRoom({
    roomId: room.roomId,
    query: queryStringParameters
  })
}

export const handler = lambdaFunction({
  schema: getListChatMessagesDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: getListChatMessages
})