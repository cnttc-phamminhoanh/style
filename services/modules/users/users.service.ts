import { DatabaseConnection } from "../../core/database";
import { In, Repository } from "typeorm";
import { Users } from "./users.entity";
import { ICreateUserService, IFindManyByUserIdsService, IFindOneUserService, IUpdateUserService } from "./users.type";

export class UsersService {
  private readonly userRepository: Repository<Users>

  constructor() {
    this.userRepository = DatabaseConnection.dataSource.getRepository(Users)
  }

  async create({
    data,
  }: ICreateUserService): Promise<Users> {
    try {
      const newUser = await this.userRepository.save(data)

      return newUser
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async update({
    query,
    data,
  }: IUpdateUserService): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({
        where: query
      })

      if (!user) {
        throw {
          code: 404,
          name: 'UserNotFound',
        }
      }

      const updatedUser = await this.userRepository.save({
        ...user,
        ...data,
      })

      return updatedUser
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOne({
    query,
    checkExist = true,
    relations = []
  }: IFindOneUserService): Promise<Users | null> {
    try {
      const user = await this.userRepository.findOne({
        where: query,
        relations,
      })

      if (!user && checkExist) {
        throw {
          code: 404,
          name: 'UserNotFound'
        }
      }

      return user
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findManyByUserIds({
    query,
    relations = []
  }: IFindManyByUserIdsService): Promise<Users[]> {
    try {
      if (!query.userIds?.length) {

        return []
      }

      const users = await this.userRepository.find({
        where: {
          userId: In(query.userIds),
        },
      })

      if (!users?.length) {

        return []
      }

      return users
    } catch (error) {
      return Promise.reject(error)
    }
  }
}