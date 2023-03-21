import { OrderBy } from "common/types";
import { Repository } from "typeorm";
import { DatabaseConnection } from "../../core/database";
import { UsersPricing } from "./usersPricing.entity";
import {
  ICreateUserPricingService,
  IFindManyUserPricingResult,
  IFindManyUserPricingService,
  IFindOneUserPricingService,
  IUpdateUserPricingService,
  UsersPricingSortBy,
} from "./usersPricing.type";

export class UsersPricingService {
  private readonly usersPricingRepository: Repository<UsersPricing>

  constructor() {
    this.usersPricingRepository = DatabaseConnection.dataSource.getRepository(UsersPricing)
  }

  async createUsersPricing({
    data,
  }: ICreateUserPricingService): Promise<UsersPricing> {
    try {
      const newUserPricing = await this.usersPricingRepository.save(data)

      return newUserPricing
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateUsersPricing({
    query,
    data,
  }: IUpdateUserPricingService): Promise<boolean> {
    try {
      const userPricing = await this.usersPricingRepository.findOne({
        where: query
      })

      if (!userPricing) {
        throw {
          code: 404,
          name: 'UsersPricingNotFound',
        }
      }

      await this.usersPricingRepository.update(
        { userId: userPricing.userId },
        data,
      );

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOneUsersPricing({
    query,
    checkExist = true
  }: IFindOneUserPricingService): Promise<UsersPricing | null> {
    try {
      const userPricing = await this.usersPricingRepository.findOne({
        where: query
      })

      if (!userPricing && checkExist) {
        throw {
          code: 404,
          name: 'UsersPricingNotFound'
        }
      }

      return userPricing
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findManyUsersPricing({
    query,
  }: IFindManyUserPricingService): Promise<IFindManyUserPricingResult> {
    try {
      const { limit = 10, offset = 0, sortBy = UsersPricingSortBy.CREATED_AT, orderBy = OrderBy.DESC, ...newQuery } = query

      const [ usersPricing, totalCount ] = await this.usersPricingRepository.findAndCount({
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