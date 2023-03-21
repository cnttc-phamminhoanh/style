import { DatabaseConnection } from "core/database";
import { Between, In, Not, Repository } from "typeorm";
import { CustomerRequests } from "./customerRequests.entity";
import {
  CustomerRequestSortBy,
  CustomerRequestsStatus,
  ICreateCustomerRequest,
  IDeleteCustomerRequest,
  IFindManyCustomerRequest,
  IFindManyCustomerRequestResult,
  IFindOneCustomerRequest,
  IUpdateCustomerRequest
} from "./customerRequests.type";
import { validateDataAccessToObject } from '../../common/validateDataAccess'
import { defaultCustomerRequestDuration } from "constant/constant";
import { OrderBy } from "common/types";
import { buildFilterInRange } from '../../common/helpers'

export class CustomerRequestsService {
  private readonly customerRequestsRepository: Repository<CustomerRequests>

  constructor() {
    this.customerRequestsRepository = DatabaseConnection.dataSource.getRepository(CustomerRequests)
  }

  private async checkConflictTime(time: Date, customerId: string): Promise<boolean> {
    const startTime = new Date(time.getTime() - defaultCustomerRequestDuration * 60000);
    const endTime = new Date(time.getTime() + defaultCustomerRequestDuration * 60000);

    const customerRequest = await this.customerRequestsRepository.findOne({
      where: {
        customerId,
        time: Between(startTime, endTime),
        status: Not(In([CustomerRequestsStatus.EXPIRED, CustomerRequestsStatus.CLOSED]))
      }
    })

    return customerRequest ? true : false
  }

  async create({ data }: ICreateCustomerRequest): Promise<CustomerRequests> {
    const isConflictTime = await this.checkConflictTime(data.time, data.customerId)

    if (isConflictTime) {
      throw {
        code: 400,
        name: 'CustomerRequestConflictTime'
      }
    }

    return await this.customerRequestsRepository.save(data)
  }

  async findOne({ query, relations = [] }: IFindOneCustomerRequest): Promise<CustomerRequests> {
    const customerRequest = await this.customerRequestsRepository.findOne({
      where: query,
      relations
    })

    if (!customerRequest) {
      throw {
        code: 404,
        name: 'CustomerRequestNotFound'
      }
    }

    return customerRequest
  }

  async findMany({ query }: IFindManyCustomerRequest): Promise<IFindManyCustomerRequestResult> {
    const {
      limit = 10,
      offset = 0,
      sortBy = CustomerRequestSortBy.CREATED_AT,
      sortDirection = OrderBy.DESC,
      fromDate,
      toDate,
      fromPrice,
      toPrice ,
      ...newQuery } = query ?? { }

    const where = {
       ...newQuery,
      time: buildFilterInRange(fromDate, toDate),
      price: buildFilterInRange(fromPrice, toPrice)
    }

    const [customerRequests, totalCount] = await this.customerRequestsRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: {
        [sortBy]: sortDirection
      }
    })

    return {
      totalCount,
      list: customerRequests
    }
  }

  async delete({ query, user }: IDeleteCustomerRequest): Promise<boolean> {
    const customerRequest = await this.customerRequestsRepository.findOneBy(query)

    const statusDelete = { ...CustomerRequestsStatus }
    delete statusDelete.EXPIRED

    if (customerRequest && customerRequest.status in statusDelete) {
      validateDataAccessToObject(user, customerRequest)
      await this.customerRequestsRepository.delete(query)

      return true
    }

    return false
  }

  async update({ data, query, user }: IUpdateCustomerRequest): Promise<CustomerRequests> {
    const customerRequest = await this.customerRequestsRepository.findOneBy(query)

    if (!customerRequest) {
      throw {
        code: 404,
        name: 'CustomerRequestsNotFound'
      }
    }

    validateDataAccessToObject(user, customerRequest)

    if (!Object.keys(data).length) {
      return customerRequest
    }

    if (data.time && data.time.getTime() !== customerRequest.time.getTime()) {
      const isConflictTime = await this.checkConflictTime(data.time, user.userId)

      if (isConflictTime) {
        throw {
          code: 400,
          name: 'CustomerRequestConflictTime'
        }
      }

    }

    await this.customerRequestsRepository.update(query.customerRequestId, data)

    return {
      ...customerRequest,
      ...data
    }
  }

}
