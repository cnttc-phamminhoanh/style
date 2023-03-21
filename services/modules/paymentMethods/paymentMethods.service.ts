import { validateDataAccessToArray, validateDataAccessToObject } from "../../common/validateDataAccess";
import { DatabaseConnection } from "core/database";
import { Repository } from "typeorm";
import { PaymentMethods } from "./paymentMethods.entity";
import {
  ICreatePaymentMethodsService,
  IFindManyPaymentMethodsResult,
  IFindManyPaymentMethodsService,
  IFindOnePaymentMethodService,
  PaymentMethodsSortBy
} from "./paymentMethods.type";
import { SortDirection } from "common/types";

export class PaymentMethodsService {
  private readonly paymentMethodsRepository: Repository<PaymentMethods>;

  constructor() {
    this.paymentMethodsRepository = DatabaseConnection.dataSource.getRepository(PaymentMethods);
  }

  async createPaymentMethods({
    data,
  }: ICreatePaymentMethodsService): Promise<PaymentMethods> {
    try {
      const newPaymentMethod = await this.paymentMethodsRepository.save(data);

      return newPaymentMethod;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOnePaymentMethod({
    query,
    credentials,
  }: IFindOnePaymentMethodService): Promise<PaymentMethods> {
    try {
      const paymentMethod = await this.paymentMethodsRepository.findOne({
        where: query,
      })

      if (!paymentMethod) {
        throw {
          code: 404,
          name: 'PaymentMethodNotFound'
        }
      }

      validateDataAccessToObject(credentials, paymentMethod, 'customerId')

      return paymentMethod;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findManyPaymentMethods({
    query,
    credentials,
    relations = [],
  }: IFindManyPaymentMethodsService): Promise<IFindManyPaymentMethodsResult> {
    try {
      const {
        limit = 10,
        offset = 0,
        sortBy = PaymentMethodsSortBy.CREATED_AT,
        sortDirection = SortDirection.DESC,
        ...newQuery
      } = query

      const [ payments, totalCount ] = await this.paymentMethodsRepository.findAndCount({
        where: { ...newQuery },
        relations,
        take: limit,
        skip: offset,
        order: {
          [sortBy]: sortDirection
        },
      })

      const validData = validateDataAccessToArray(credentials, payments) as PaymentMethods[];

      return {
        list: validData,
        totalCount
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

