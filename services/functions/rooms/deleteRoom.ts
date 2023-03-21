import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { RoomsService } from "../../modules/rooms/rooms.service";
import { deleteRoomDto } from "../../modules/rooms/rooms.dto";

const deleteRoom: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const { user, pathParameters } = event;
  const roomsService = new RoomsService();

  return await roomsService.deleteRoom({
    query: {
      roomId: pathParameters.roomId,
    },
    credentials: user,
  });
};

export const handler = lambdaFunction({
  schema: deleteRoomDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: deleteRoom,
});
