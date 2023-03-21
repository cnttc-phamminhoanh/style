import { DatabaseConnection } from "../../core/database";
import { In, Repository } from "typeorm";
import { Services } from "../../modules/services/services.entity";
import {
  ICreateOneServiceService,
  ICreateServiceService,
  IDeleteServiceService,
  IFindManyServiceService,
  IFindManyServicesResult,
  IFindManyServicesService,
  IFindOneServiceService,
  IUpdateManyServiceService,
  IUpdateOneServiceService,
  ServicesSortBy
} from "../../modules/services/services.type";
import { validateDataAccessToObject } from "../../common/validateDataAccess";
import { mergeServices } from "./helper";
import { SortDirection } from "common/types";



export class ServicesServices {
  private readonly  servicesRepository: Repository<Services>;

  constructor() {
    this.servicesRepository = DatabaseConnection.dataSource.getRepository(Services);
  }

  async createService({
    data,
  }: ICreateServiceService): Promise<Services[]> {
    try {
      const { stylistId, services } = data

      const mappedServices = services.map((obj) => {
        obj.stylistId = stylistId;

        return obj;
      })

      const newServices = await this.servicesRepository.save(mappedServices);

      return newServices;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateServices({
    data,
  }: IUpdateManyServiceService): Promise<Services[]> {
    try {
      const { services, stylist } = data
      const oldServices = stylist?.services

      const mergedServices = mergeServices(oldServices, services, stylist.stylistId)

      const newServices = await this.servicesRepository.save(mergedServices);

      return newServices;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createOneService({
    data,
  }: ICreateOneServiceService): Promise<Services> {
    try {
      const newServices = await this.servicesRepository.save(data);

      return newServices;
    } catch (error) {
      return Promise.reject(error);
    }
  }


  async findOneService({
    query,
  }: IFindOneServiceService): Promise<Services | null> {
    try {
      const service = await this.servicesRepository.findOne({
        where: query
      })

      if (!service) {
        throw {
          code: 404,
          name: 'ServiceNotFound'
        }
      }

      return service
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findManyServices({
    query,
  }: IFindManyServicesService): Promise<IFindManyServicesResult> {
    try {
      const { limit = 10,
        offset = 0,
        sortBy = ServicesSortBy.CREATED_AT,
        sortDirection = SortDirection.DESC,
        ...newQuery
      } = query

      const [ services, totalCount ] = await this.servicesRepository.findAndCount({
        where: newQuery,
        take: limit,
        skip: offset,
        order: {
          [sortBy]: sortDirection
        },
      })

      return {
        list: services ,
        totalCount
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async updateOneService({
    query,
    data,
    user,
  }: IUpdateOneServiceService): Promise<boolean> {
    try {
      const service = await this.servicesRepository.findOne({
        where: query
      })

      if (!service) {
        throw {
          code: 404,
          name: 'ServiceNotFound',
        }
      }

      validateDataAccessToObject(user, service, 'stylistId');

      await this.servicesRepository.update(
        { serviceId: service.serviceId },
        data,
      );

      return true
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteService({
    query,
    user
  }: IDeleteServiceService): Promise<boolean> {
    try {
      const service = await this.servicesRepository.findOne({
        where: query
      })

      if (!service) {
        throw {
          code: 404,
          name: 'ServiceNotFound',
        }
      }

      validateDataAccessToObject(user, service, 'stylistId');

      await this.servicesRepository.softDelete(query);

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findManyWithServiceIds({
    query,
  }: IFindManyServiceService): Promise<Services[]> {
    try {
      const services = await this.servicesRepository.find({
        where: { serviceId: In(query.serviceIds) }
      })

      if (!services) {
        
        return []
      }

      return services
    } catch (error) {
      return Promise.reject(error)
    }
  }

}