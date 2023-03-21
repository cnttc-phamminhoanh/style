import { validateDataAccessToArray, validateDataAccessToObject } from "../../common/validateDataAccess";
import { DatabaseConnection } from "core/database";
import { Repository } from "typeorm";
import { Payments } from "./payments.entity";
import {
  ICreatePaymentService,
  IFindManyPaymentsResult,
  IFindManyPaymentsService,
  IFindOnePaymentService,
  IUpdatePaymentService,
  PaymentsSortBy
} from "./payments.type";
import { SortDirection } from "../../common/types";
import { buildFilterInRange } from "../../common/helpers";

export class PaymentsService {
  private readonly paymentRepository: Repository<Payments>;

  constructor() {
    this.paymentRepository = DatabaseConnection.dataSource.getRepository(Payments);
  }

  async createPayment({
    data,
  }: ICreatePaymentService): Promise<Payments> {
    try {
      const newPayment = await this.paymentRepository.save(data)

      return newPayment;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOnePayment({
    query,
    credentials
  }: IFindOnePaymentService): Promise<Payments> {
    try {
      const payment  = await this.paymentRepository.findOne({
        where: query
      })

      if (!payment) {
        throw {
          code: 404,
          name: 'PaymentNotFound'
        }
      }

      validateDataAccessToObject(credentials, payment)

      return payment
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updatePayment({
    query,
    data,
    credentials,
  }: IUpdatePaymentService): Promise<boolean> {
    try {

      const payment = await this.paymentRepository.findOne({
        where: query,
      })

      validateDataAccessToObject(credentials, payment);

      await this.paymentRepository.update(
        { paymentId: payment.paymentId },
        data
      );

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findManyPayments({
    query,
    credentials,
    relations = [],
  }: IFindManyPaymentsService): Promise<IFindManyPaymentsResult> {
    try {
      const {
        limit = 10,
        offset = 0,
        sortBy = PaymentsSortBy.CREATED_AT,
        sortDirection = SortDirection.DESC,
        fromGrossAmount,
        toGrossAmount,
        fromNetAmount,
        toNetAmount,
        ...newQuery
      } = query

      const where = {
        ...newQuery,
       grossAmount: buildFilterInRange(fromGrossAmount, toGrossAmount),
       netAmount: buildFilterInRange(fromNetAmount, toNetAmount)
     }

      const [ payments, totalCount ] = await this.paymentRepository.findAndCount({
        where,
        relations,
        take: limit,
        skip: offset,
        order: {
          [sortBy]: sortDirection
        },
      })

      const validData = validateDataAccessToArray(credentials, payments) as Payments[];

      return {
        list: validData,
        totalCount
      }
    } catch (error) {
        return Promise.reject(error)
    }
  }
}
