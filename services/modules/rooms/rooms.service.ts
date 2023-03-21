import { SortDirection } from "common/types";
import { validateDataAccessToObject } from "common/validateDataAccess";
import { DatabaseConnection } from "core/database";
import { RoomMembers } from "../../modules/roomMembers/roomMembers.entity";
import { Like, Repository } from "typeorm";
import { Rooms } from "./rooms.entity";
import { validateDataAccessToArrayRooms, validateDataAccessToObjectRoom } from "./validateAccess";
import {
  ICreateRoomService,
  IDeleteRoomService,
  IFindManyRoomsResult,
  IFindManyRoomsService,
  IFindOneRoomService,
  IWhereQuery,
  IGetRoomFromUserIdsService,
  IUpdateRoomService,
  RoomSortBy,
  RoomStatus
} from "./rooms.type";


export class RoomsService {
  private readonly roomsRepository: Repository<Rooms>

  constructor() {
    this.roomsRepository = DatabaseConnection.dataSource.getRepository(Rooms)
  }

  async createRoom({
    data,
  }: ICreateRoomService): Promise<Rooms> {
    try {
      const newRoom = await this.roomsRepository.save(
        data
      )

      return newRoom
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateRoom({
    query,
    data,
    credentials
  }: IUpdateRoomService): Promise<boolean> {
    try {
      const room = await this.roomsRepository.findOne({
        where: query,
        relations: ['roomMembers']
      });

      if (!room) {
        throw {
          code: 404,
          name: "RoomNotFound",
        };
      }

      if (room?.status !== RoomStatus.ACTIVE) {
        throw {
          code: 400,
          name: `Room was ${room.status.toLowerCase()}`,
        };
      }

      validateDataAccessToObjectRoom(room, credentials)

      await this.roomsRepository.update(
        { roomId: room.roomId },
        data
      )

      return true
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteRoom({
    query,
    credentials
  }: IDeleteRoomService): Promise<boolean> {
    try {
      const room = await this.roomsRepository.findOne({
        where: query
      })

      if (!room) {
        throw {
          code: 404,
          name: 'RoomNotFound',
        }
      }

      validateDataAccessToObject(credentials, room, 'createdBy');

      await this.roomsRepository.delete({ roomId: room.roomId });

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findManyRooms({
    query,
    credentials,
    relations = [],
  }: IFindManyRoomsService): Promise<IFindManyRoomsResult> {
    try {
      const {
        limit = 10,
        offset = 0,
        sortBy = RoomSortBy.CREATED_AT,
        sortDirection = SortDirection.DESC,
        name,
        description,
        ...newQuery
      } = query
      let where: IWhereQuery = newQuery

      if (name) {
        where = {
          name: Like(`%${name}%`),
          ...where
        }
      }

      if (description) {
        where = {
          description: Like(`%${description}%`),
          ...where
        }
      }

      const [ rooms, totalCount ] = await this.roomsRepository.findAndCount({
        where,
        relations,
        take: limit,
        skip: offset,
        order: {
          [sortBy]: sortDirection
        },
      })

      const validData = validateDataAccessToArrayRooms(rooms, credentials)

      return {
        list: validData,
        totalCount
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getRoomFromUserIds({
    query,
  }: IGetRoomFromUserIdsService): Promise<Rooms[]> {
    try {
      const rooms = await DatabaseConnection.dataSource
        .createQueryBuilder()
        .from(subQuery => {
          return subQuery
              .select('rm."roomId"')
              .addSelect('json_agg(rm."userId")', 'members')
              .from(RoomMembers, 'rm')
              .where('rm.userId IN (:...ids)', { ids: query.userIds })
              .groupBy('rm."roomId"')
        }, 'q')
        .select('r.*')
        .addSelect(`json_agg(json_build_object('roomMemberId', rm2."roomMemberId", 'userId', rm2."userId", 'roomId', rm2."roomId", 'status' , rm2."status", 'createdAt' , rm2."createdAt", 'updatedAt' , rm2."updatedAt"))`, 'roomMembers')
        .innerJoin('rooms', 'r', 'r."roomId" = q."roomId"')
        .leftJoin('room_members', 'rm2', 'rm2."roomId" = r."roomId"')
        .groupBy('r.roomId')
        .where('json_array_length(q."members") = :length', { length: query.userIds.length})
        .getRawMany();

      const filterRooms = rooms.filter(room => {
        if (typeof room.roomMembers  === 'string' && room.roomMembers) {
          const roomMembers = JSON.parse(room.roomMembers)
          room.roomMembers = roomMembers
        }

        return room.roomMembers?.length === query.userIds.length
      })

      return filterRooms
    } catch (error) {
      return Promise.reject(error)
    }
  }



  async findOneRoom({
    query,
    relations = [],
    credentials,
  }: IFindOneRoomService): Promise<Rooms | null> {
    try {
      const room = await this.roomsRepository.findOne({
        where: query,
        relations
      })

      if (!room) {
        throw {
          code: 404,
          name: 'RoomNotFound'
        }
      }

      validateDataAccessToObjectRoom(room, credentials)

      return room
    } catch (error) {
      return Promise.reject(error)
    }
  }
}