import { Services } from "../../modules/services/services.entity";

interface ICreateAppointmentServicesData {
  services?: Services[]
  appointmentId: string;
  customerId: string;
  createdBy?: string;
}

export interface ICreateAppointmentServices {
  data: ICreateAppointmentServicesData;
}

interface IErrorService {
  serviceId: string
  error: string
}

export interface IValidateServiceIdsResult {
  services: Services[]
  errors: IErrorService[]
}

interface IFindAppointmentServicesData {
  appointmentId: string;
}

export interface IFindAppointmentServices {
  query: IFindAppointmentServicesData;
}
