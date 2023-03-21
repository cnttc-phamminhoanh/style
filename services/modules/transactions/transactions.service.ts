import { Repository } from "typeorm";
import { DatabaseConnection } from "core/database";
import { Transactions } from "./transactions.entity";
import { ICreateTransactionService, IFindManyTransactionsResult, IFindManyTransactionsService, IFindOneTransactionService, IUpdateTransactionService, TransactionsSortBy } from "./transactions.type";
import { validateDataAccessToArray, validateDataAccessToObject } from "../../common/validateDataAccess";
import { SortDirection } from "../../common/types";
import { buildFilterInRange } from "../../common/helpers";


export class TransactionsService {
  private readonly transactionRepository: Repository<Transactions>;

  constructor() {
    this.transactionRepository = DatabaseConnection.dataSource.getRepository(Transactions);
  }

  async createTransaction({
    data,
  }: ICreateTransactionService): Promise<Transactions> {
    try {
      const newTransaction = await this.transactionRepository.save(data)

      return newTransaction;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOneTransaction({
    query,
    credentials
  }: IFindOneTransactionService): Promise<Transactions> {
    try {
      const transaction  = await this.transactionRepository.findOne({
        where: query
      })

      if (!transaction) {
        throw {
          code: 404,
          name: 'TransactionNotFound'
        }
      }

      validateDataAccessToObject(credentials, transaction)

      return transaction
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateTransaction({
    query,
    data,
    credentials,
  }: IUpdateTransactionService): Promise<boolean> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: query,
      })

      validateDataAccessToObject(credentials, transaction);

      await this.transactionRepository.update(
        { transactionId: transaction.transactionId },
        data
      );

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findManyTransactions({
    query,
    credentials,
    relations = [],
  }: IFindManyTransactionsService): Promise<IFindManyTransactionsResult> {
    try {
      const {
        limit = 10,
        offset = 0,
        sortBy = TransactionsSortBy.CREATED_AT,
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

      const [ transactions, totalCount ] = await this.transactionRepository.findAndCount({
        where,
        relations,
        take: limit,
        skip: offset,
        order: {
          [sortBy]: sortDirection
        },
      })

      const validData = validateDataAccessToArray(credentials, transactions) as Transactions[];

      return {
        list: validData,
        totalCount
        }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}