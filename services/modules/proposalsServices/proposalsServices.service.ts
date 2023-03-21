import { buildFilterInRange } from "common/helpers";
import { SortDirection } from "common/types";
import { validateDataAccessToArray, validateDataAccessToObject } from "common/validateDataAccess";
import { Repository } from "typeorm";
import { DatabaseConnection } from "../../core/database";
import { ProposalsServices } from "./proposalsServices.entity";
import {
  ICreateProposalServiceServices,
  ICreateProposalsServicesService,
  IDeleteProposalServiceService,
  IFindManyProposalServicesResult,
  IFindManyProposalServicesService,
  IFindOneProposalServiceService,
  IUpdateProposalsServicesService,
  ProposalServiceSortBy,
} from "./proposalsServices.type";

export class ProposalsServicesService {
  private readonly proposalsServicesRepository: Repository<ProposalsServices>;

  constructor() {
    this.proposalsServicesRepository =
      DatabaseConnection.dataSource.getRepository(ProposalsServices);
  }

  async createProposalsServices({
    data,
  }: ICreateProposalsServicesService): Promise<ProposalsServices[]> {
    try {
      const { services = [], ...newData } = data;

      if (!services?.length) {

        return [];
      }

      const newServices = services.map((service) => {

        return {
          serviceId: service.serviceId,
          price: service.price,
          stylistId: service.stylistId,
          ...newData,
        };
      });

      const newProposalsServices = await this.proposalsServicesRepository.save(
        newServices
      );

      return newProposalsServices;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateProposalService({
    query,
    data,
  }: IUpdateProposalsServicesService): Promise<boolean> {
    try {

      await this.proposalsServicesRepository.update(
        query,
        data
      );

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findOneProposalService({
    query,
    user,
  }: IFindOneProposalServiceService): Promise<ProposalsServices | null> {
    try {
      const proposalService = await this.proposalsServicesRepository.findOne({
        where: query,
      })

      if (!proposalService) {
        throw {
          code: 404,
          name: 'ProposalServiceNotFound'
        }
      }

      validateDataAccessToObject(user, proposalService, 'stylistId');

      return proposalService
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createOneProposalService({
    data,
  }: ICreateProposalServiceServices): Promise<ProposalsServices> {
    try {
      const newProposalService = await this.proposalsServicesRepository.save(
        data
      );

      return newProposalService;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteProposalService({
    query,
    user
  }: IDeleteProposalServiceService): Promise<boolean> {
    try {
      const proposalService = await this.proposalsServicesRepository.findOne({
        where: query
      })

      if (!proposalService) {
        throw {
          code: 404,
          name: 'ProposalServiceNotFound',
        }
      }

      validateDataAccessToObject(user, proposalService, 'stylistId');

      await this.proposalsServicesRepository.delete({ proposalServiceId: proposalService.proposalServiceId });

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findManyProposalServices({
    query,
    user,
  }: IFindManyProposalServicesService): Promise<IFindManyProposalServicesResult> {
    try {
      const {
        limit = 10,
        offset = 0,
        sortBy = ProposalServiceSortBy.CREATED_AT,
        sortDirection = SortDirection.DESC,
        fromPrice,
        toPrice,
        ...newQuery
      } = query

      const where = {
        ...newQuery,
        price: buildFilterInRange(fromPrice, toPrice)
      }

      const [ proposalServices, totalCount ] = await this.proposalsServicesRepository.findAndCount({
        where,
        take: limit,
        skip: offset,
        order: {
          [sortBy]: sortDirection
        },
      })

      const validData = await validateDataAccessToArray(user, proposalServices) as ProposalsServices[];

      return {
        list: validData,
        totalCount
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

}
