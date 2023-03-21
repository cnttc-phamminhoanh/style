import { TransactionLogs } from "./transactionLogs.entity";
import { Repository } from "typeorm";
import { DatabaseConnection } from "core/database";
import { ICreateTransactionLogService } from "./transactionLogs.type";

export class TransactionLogsService {
  private readonly transactionLogRepository: Repository<TransactionLogs>;

  constructor() {
    this.transactionLogRepository = DatabaseConnection.dataSource.getRepository(TransactionLogs);
  }

  async createTransactionLog({
    data,
  }: ICreateTransactionLogService): Promise<TransactionLogs> {
    try {
      const newTransaction = await this.transactionLogRepository.save(data)

      return newTransaction;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}