import { OrderBy } from "common/types";
import { Repository } from "typeorm"
import { DatabaseConnection } from "../../core/database";
import { UsersSchedule } from "./usersSchedule.entity"
import { ICreateUserScheduleService, IFindManyUserScheduleResult, IFindManyUserScheduleService, IFindOneUserScheduleService, IUpdateUserScheduleService, UsersScheduleSortBy } from "./usersSchedule.type";

export class UsersScheduleService {
  private readonly usersScheduleRepository: Repository<UsersSchedule>

  constructor() {
    this.usersScheduleRepository = DatabaseConnection.dataSource.getRepository(UsersSchedule)
  }

  async createUsersSchedule({
    data,
  }: ICreateUserScheduleService): Promise<UsersSchedule> {
    try {
      const newUserSchedule = await this.usersScheduleRepository.save(data)

      return newUserSchedule
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateUsersSchedule({
    query,
    data,
  }: IUpdateUserScheduleService): Promise<boolean> {
    try {
      const userSchedule = await this.usersScheduleRepository.findOne({
        where: query
      })

      if (!userSchedule) {
        throw {
          code: 404,
          name: 'UsersScheduleNotFound',
        }
      }

      await this.usersScheduleRepository.update(
        { userId: userSchedule.userId },
        data,
      );

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOneUsersSchedule({
    query,
    checkExist = true
  }: IFindOneUserScheduleService): Promise<UsersSchedule | null> {
    try {
      const userSchedule = await this.usersScheduleRepository.findOne({
        where: query
      })

      if (!userSchedule && checkExist) {
        throw {
          code: 404,
          name: 'UsersScheduleNotFound'
        }
      }

      return userSchedule
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findManyUsersSchedule({
    query,
  }: IFindManyUserScheduleService): Promise<IFindManyUserScheduleResult> {
    try {
      const { limit = 10, offset = 0, sortBy = UsersScheduleSortBy.createdAt, orderBy = OrderBy.DESC, ...newQuery } = query

      const [ usersPricing, totalCount ] = await this.usersScheduleRepository.findAndCount({
        where: newQuery,
        take: limit,
        skip: offset,
        order: {
          [sortBy]: orderBy
        },
      })

      return {
        list: usersPricing,
        totalCount
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}