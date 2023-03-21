import { DatabaseConnection } from "core/database";
import { Repository } from "typeorm";
import { ConnectedAccounts } from "./connectedAccounts.entity";
import {
  ConnectedAccountsStatus,
  ICheckConnectedAccountResult,
  ICheckConnectedAccountService,
  ICreateConnectedAccountService,
  IFindOneConnectedAccountService,
  IUpdateConnectedAccountService
} from "./connectedAccounts.type";

export class ConnectedAccountService {
  private readonly connectedAccountRepository: Repository<ConnectedAccounts>

  constructor() {
    this.connectedAccountRepository = DatabaseConnection.dataSource.getRepository(ConnectedAccounts)
  }

  async createConnectedAccount({
    data,
  }: ICreateConnectedAccountService): Promise<ConnectedAccounts> {
    try {
      const newConnectedAccount = await this.connectedAccountRepository.save({
        stylistId: data.stylistId,
        stripeConnectedAccountId: data.stripeConnectedAccountId,
        type: data.type,
        status: data.status
      });

      return newConnectedAccount
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateConnectedAccount({
    data,
    query
  }: IUpdateConnectedAccountService): Promise<boolean> {
    try {
      await this.connectedAccountRepository.update(
        { stylistId: query.stylistId },
        data
      )

      return true
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOneConnectedAccount({
    query,
  }: IFindOneConnectedAccountService): Promise<ConnectedAccounts> {
    try {
      const connectedAccount = await this.connectedAccountRepository.findOne({
        where: query
      })

      if (!connectedAccount) {
        throw {
          code: 404,
          name: 'ConnectedAccountNotFound',
        }
      }

      return connectedAccount
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async checkConnectedAccount({
    query,
  }: ICheckConnectedAccountService): Promise<ICheckConnectedAccountResult> {
    try {
      const connectedAccount = await this.connectedAccountRepository.findOne({
        where: query
      })

      if (!connectedAccount || connectedAccount.status !== ConnectedAccountsStatus.ACTIVE ) {

        return {
          hasConnectedAccount: false,
          status: connectedAccount?.status
        }
      }

      return {
        hasConnectedAccount: true,
        status: connectedAccount.status
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

}