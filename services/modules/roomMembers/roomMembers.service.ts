
import { DatabaseConnection } from "core/database";
import { Repository } from "typeorm";
import { RoomMembers } from "./roomMembers.entity";
import { ICreateManyRoomMembersService } from "./roomMembers.type";

export class RoomMembersService {
  private readonly roomMembersRepository: Repository<RoomMembers>

  constructor() {
    this.roomMembersRepository = DatabaseConnection.dataSource.getRepository(RoomMembers)
  }

  async createRoomMembers({
    data,
  }: ICreateManyRoomMembersService): Promise<RoomMembers[]> {
    try {
      if (!data?.userIds?.length) {

        return []
      }

      const roomMembers = data.userIds.map(userId => {

        return {
          userId,
          roomId: data.roomId
        }
      })

      const newRoomMembers = await this.roomMembersRepository.save(
        roomMembers
      )

      return newRoomMembers
    } catch (error) {
      return Promise.reject(error);
    }
  }
}