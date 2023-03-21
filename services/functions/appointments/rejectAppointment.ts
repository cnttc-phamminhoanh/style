import { LambdaFunction } from "common/types";
import { AppointmentsServices } from "../../modules/appointments/appointments.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { rejectAppointmentDto } from "../../modules/appointments/appointments.dto";
import { AppointmentStatus } from "../../modules/appointments/appointments.type";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { validateDataAccessToObject } from "../../common/validateDataAccess";

const rejectAppointment: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const { user, pathParameters } = event as any;
  const appointmentsServices = new AppointmentsServices();

  const appointment = await appointmentsServices.findOneAppointment({
    query: {
      appointmentId: pathParameters.appointmentId,
    },
  });

  validateDataAccessToObject(user, appointment, 'stylistId');

  if (appointment.status === AppointmentStatus.REJECTED) {
    throw {
      code: 400,
      name: 'AppointmentAlreadyRejected',
    }
  }

  if (appointment.status === AppointmentStatus.ACCEPTED) {
    throw {
      code: 400,
      name: 'AppointmentAlreadyAccepted',
    }
  }

  return appointmentsServices.updateAppointment({
    query: {
      appointmentId: pathParameters.appointmentId,
    },
    data: {
      status: AppointmentStatus.REJECTED,
    }
  });
};

export const handler = lambdaFunction({
  schema: rejectAppointmentDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: rejectAppointment,
});
