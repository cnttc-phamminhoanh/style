import { DatabaseConnection } from "../../core/database";
import { Repository } from "typeorm";
import { Stylists } from "./stylists.entity";
import { ICreateStylistService, IFindOneStylistService, IUpdateStylistService } from "./stylists.type";

export class StylistsServices {
  private readonly stylistsRepository: Repository<Stylists>;

  constructor() {
    this.stylistsRepository = DatabaseConnection.dataSource.getRepository(Stylists);
  }

  async updateStylist({
    stylistId,
    data,
  }: IUpdateStylistService): Promise<boolean> {
    try {
      await this.stylistsRepository.update(
        stylistId,
        data
      );

      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getOrCreateOneStylist({
    query,
    relations = []
  }: IFindOneStylistService): Promise<Stylists> {
    try {
      const stylist = await this.stylistsRepository.findOne({
        where: query,
        relations
      })

      if (!stylist) {
        const newStylist = await this.createOneStylist({
          data: {
            stylistId: query.stylistId
          }
        })

        return newStylist
      }

      return stylist;
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async createOneStylist({
    data,
  }: ICreateStylistService): Promise<Stylists> {
    try {
      const stylist = await this.stylistsRepository.save(data)

      return stylist
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOneStylist({
    query,
    relations = []
  }: IFindOneStylistService): Promise<Stylists> {
    try {
      const stylist = await this.stylistsRepository.findOne({
        where: query,
        relations
      })

      if (!stylist) {
        throw {
          code: 404,
          name: 'StylistNotFound',
        }
      }

      return stylist;
    } catch (error) {
      return Promise.reject(error)
    }
  }
}