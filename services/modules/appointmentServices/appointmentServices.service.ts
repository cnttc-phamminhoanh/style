import { Repository } from "typeorm";
import { DatabaseConnection } from "../../core/database";
import { AppointmentServices } from "./appointmentServices.entity";
import { ICreateAppointmentServices, IFindAppointmentServices } from "./appointmentServices.type";

export class AppointmentServicesService {
  private readonly appointmentServicesRepository: Repository<AppointmentServices>;

  constructor() {
    this.appointmentServicesRepository = DatabaseConnection.dataSource.getRepository(AppointmentServices);
  }

  async createAppointmentServices({
    data,
  }: ICreateAppointmentServices): Promise<AppointmentServices[]> {
    try {
      const { services = [], ...newData } = data;

      if (!services?.length) {
        return [];
      }

      const newServices = services.map(service => {

        return {
          serviceName: service.serviceName,
          serviceId: service.serviceId,
          price: service.price,
          stylistId: service.stylistId,
          ...newData
        }
      })

      const newAppointmentServices = await this.appointmentServicesRepository.save(newServices);

      return newAppointmentServices;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findAppointmentServices({
    query,
  }: IFindAppointmentServices): Promise<AppointmentServices[]> {
    try {
      const appointmentServices = await this.appointmentServicesRepository.find({
        where: query,
      })

      return appointmentServices;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
