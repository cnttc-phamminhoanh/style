import { Credentials } from "common/types";
import { RoomMemberStatus } from "../../modules/roomMembers/roomMembers.type";
import { Rooms } from "./rooms.entity";

export function validateDataAccessToArrayRooms(
  rooms: Rooms[],
  credentials: Credentials,
): Rooms[] {
  if (credentials.isAdmin) {

    return rooms
  }

  if (!rooms?.length ) {

    return []
  }

  const validData = rooms.map(room => {
    const isRoomMember = room.roomMembers.find(roomMember =>
      roomMember.userId === credentials.userId && roomMember.status === RoomMemberStatus.ACTIVE )

    return isRoomMember ? room : null
  })

  return validData
}

export function validateDataAccessToObjectRoom(
  room: Rooms,
  credentials: Credentials,
): Rooms {
  if (credentials.isAdmin) {

    return room
  }

  if (!room?.roomMembers?.length ) {
    throw {
      code: 403,
      name: 'Forbidden',
      message: `You do not have permission to access this room`
    }
  }

  const isRoomMember = room.roomMembers.find(roomMember =>
    roomMember.userId === credentials.userId && roomMember.status === RoomMemberStatus.ACTIVE)

  if (!isRoomMember) {
    throw {
      code: 403,
      name: 'Forbidden',
      message: `You do not have permission to access this room`
    }
  }

  return room
}