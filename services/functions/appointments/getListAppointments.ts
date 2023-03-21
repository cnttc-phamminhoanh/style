import { LambdaFunction } from "common/types";
import { AppointmentsServices } from "../../modules/appointments/appointments.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { getAllAppointmentsDto } from "../../modules/appointments/appointments.dto";
import { IFindManyAppointmentsResult } from "../../modules/appointments/appointments.type";

const getListAppointments: LambdaFunction = async (
  event,
  context
): Promise<IFindManyAppointmentsResult> => {
  const { user, queryStringParameters } = event;
  const appointmentsServices = new AppointmentsServices();

  const appointments = await appointmentsServices.findManyAppointments({
    query: { ...queryStringParameters },
    user,
    relations: ['customerId', 'services'],
  });

  return appointments
};

export const handler = lambdaFunction({
  schema: getAllAppointmentsDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
  ],
  handler: getListAppointments,
});
