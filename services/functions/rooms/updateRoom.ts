import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { updateRoomDto } from "../../modules/rooms/rooms.dto";
import { RoomsService } from "../../modules/rooms/rooms.service";

const updateRoom: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const { user, body, pathParameters } = event as any
  const roomsService = new RoomsService()

  return await roomsService.updateRoom({
    query: { roomId: pathParameters.roomId },
    data: body,
    credentials: user
  })
};

export const handler = lambdaFunction({
  schema: updateRoomDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: updateRoom,
});
