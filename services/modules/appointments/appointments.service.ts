import { Between, In, LessThan, MoreThan, Repository } from "typeorm";
import { DatabaseConnection } from "../../core/database";
import { Appointments } from "../../modules/appointments/appointments.entity";
import { defaultAppointmentDuration } from "../../constant/constant";
import {
  AppointmentStatus,
  ICreateAppointmentService,
  CheckAppointmentConflictService,
  IFindManyAppointmentsService,
  IFindManyAppointmentsResult,
  AppointmentsSortBy,
  Tab,
  IUpdateAppointmentService,
  IFindOneAppointmentService
} from "../../modules/appointments/appointments.type";
import { SortDirection } from "../../common/types";
import { validateDataAccessToArray } from "../../common/validateDataAccess";

export class AppointmentsServices {
  private readonly appointmentsRepository: Repository<Appointments>;

  constructor() {
    this.appointmentsRepository = DatabaseConnection.dataSource.getRepository(Appointments);
  }

  async createAppointment({
    data,
  }: ICreateAppointmentService): Promise<Appointments> {
    try {
      const newAppointment = await this.appointmentsRepository.save(data);

      return newAppointment;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async checkAppointmentConflict({
    query,
  }: CheckAppointmentConflictService): Promise<boolean> {
    try {
      if (!query.time) {
        return false;
      };

      const startTime = new Date(query.time.getTime() - defaultAppointmentDuration * 60000);
      const endTime = new Date(query.time.getTime() + defaultAppointmentDuration * 60000);

      const appointment = await this.appointmentsRepository.findOne({
        where: [
          {
            stylistId: query.stylistId,
            time: Between(startTime, endTime),
            status: In([AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED]),
          },
          {
            customerId: query.customerId,
            time: Between(startTime, endTime),
            status: In([AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED]),
          }
        ]
      });

      if (appointment) {
        return true; // If have conflict then return true
      }

      return false;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateAppointment({
    query,
    data,
  }: IUpdateAppointmentService): Promise<boolean> {
    try {
      const appointment = await this.appointmentsRepository.findOne({
        where: query
      });

      if (!appointment) {
        throw {
          code: 404,
          name: 'AppointmentNotFound',
        }
      }

      await this.appointmentsRepository.update(
        { appointmentId: appointment.appointmentId },
        data,
      );

      return true
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async findOneAppointment({
    query,
    checkExist = true,
    relations = []
  }: IFindOneAppointmentService): Promise<Appointments | undefined> {
    try {
      if (!query.appointmentId) {
        return undefined
      }

      const appointment = await this.appointmentsRepository.findOne({
        where: query,
        relations
      })

      if (!appointment && checkExist) {
        throw {
          code: 404,
          name: 'AppointmentNotFound'
        }
      }

      return appointment
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async checkAppointmentExists({
    query,
  }: CheckAppointmentConflictService): Promise<boolean> {
    try {
      if (!query.time) {
        return false;
      };

      const startTime = new Date(query.time.getTime() - defaultAppointmentDuration * 60000);
      const endTime = new Date(query.time.getTime() + defaultAppointmentDuration * 60000);

      const appointment = await this.appointmentsRepository.findOne({
        where: {
          stylistId: query.stylistId,
          customerId: query.customerId,
          time: Between(startTime, endTime),
          status: In([AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED])
        },
      });

      if (!appointment) {
        return false
      }

      return true // If have appointment for this stylist then return true
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async findManyAppointments({
    query,
    user,
    relations = []
  }: IFindManyAppointmentsService): Promise<IFindManyAppointmentsResult> {
    try {
      const {
        limit = 10,
        offset = 0,
        sortBy = AppointmentsSortBy.createdAt,
        sortDirection = SortDirection.DESC,
        tab,
        ...newQuery
      } = query;
      const nowDate = new Date(); // Time right now
      let timingQuery = { }

      if (tab === Tab.PASS) {
        timingQuery = { time: LessThan(nowDate) };
      }

      if (tab === Tab.UPCOMING) {
        timingQuery = { time: MoreThan(nowDate) };
      }

      const [appointments, totalCount] = await this.appointmentsRepository.findAndCount({
        where: {
          ...newQuery,
          ...timingQuery,
        },
        relations,
        select: {
          appointmentId: true,
          stylistId: true,
          createdBy: true,
          status: true,
          time: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          customerId: {
            firstName: true,
            lastName: true,
            avatar: true,
            userId: true
          },
          services: true,
        },
        take: limit,
        skip: offset,
        order: {
          [sortBy]: sortDirection
        },
      });

      const validData = validateDataAccessToArray(user, appointments);

      return {
        list: validData,
        totalCount,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
