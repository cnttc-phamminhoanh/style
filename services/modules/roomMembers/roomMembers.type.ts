export enum RoomMemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
interface ICreateManyRoomMembersData {
  roomId: string
  userIds: string[]
}

export interface ICreateManyRoomMembersService {
  data: ICreateManyRoomMembersData
}