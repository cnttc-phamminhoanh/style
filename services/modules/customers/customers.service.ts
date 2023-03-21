import { DatabaseConnection } from "core/database";
import { Repository } from "typeorm";
import { Customers } from "./customers.entity";
import { ICreateCustomerData, IFindOneCustomerService, IUpdateCustomerService } from "./customers.type";

export class CustomersService {
  private readonly customersRepository: Repository<Customers>

  constructor() {
    this.customersRepository = DatabaseConnection.dataSource.getRepository(Customers)
  }

  async create({ data }: ICreateCustomerData): Promise<Customers> {
    return await this.customersRepository.save(data)
  }

  async getOrCreateOneCustomer(customerId: string): Promise<Customers> {
    const customer = await this.customersRepository.findOneBy({
      customerId
    })

    return customer ? customer : await this.customersRepository.save({ customerId })
  }

  async updateCustomer({
    query,
    data,
  }: IUpdateCustomerService): Promise<boolean> {
    try {
      const customer = await this.customersRepository.findOne({
        where: query
      })

      if (!customer) {
        throw {
          code: 404,
          name: 'CustomerNotFound',
        }
      }

      await this.customersRepository.update(
        { customerId: customer.customerId },
        data,
      )

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOneCustomer({
    query,
  }: IFindOneCustomerService): Promise<Customers> {
    try {
      const customer = await this.customersRepository.findOne({
        where: query
      })

      if (!customer) {
        throw {
          code: 404,
          name: 'CustomerNotFound',
        }
      }

      return customer
    } catch (error) {
      return Promise.reject(error)
    }
  }
}