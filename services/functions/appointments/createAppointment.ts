import { LambdaFunction } from "common/types";
import { AppointmentsServices } from "../../modules/appointments/appointments.service";
import { AppointmentServicesService } from "../../modules/appointmentServices/appointmentServices.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { createAppointmentDto } from "../../modules/appointments/appointments.dto";
import { Appointments } from "../../modules/appointments/appointments.entity";
import { checkRole } from "../../middleware/authz";
import { UsersService } from "../../modules/users/users.service";
import { UserStatus } from "../../modules/users/users.type";
import { RoleName } from "../../modules/permissions/permissions.type";
import { StylistsServices } from "modules/stylists/stylists.service";
import { validateServiceIds } from "modules/appointmentServices/helper";

const createAppointment: LambdaFunction = async (
  event,
  context
): Promise<Appointments> => {
  const { user, body } = event as any;
  const { serviceIds = [], ...newBody } = body;
  const appointmentsServices = new AppointmentsServices();
  const appointmentServicesService = new AppointmentServicesService();
  const userService = new UsersService();
  const stylistsServices = new StylistsServices();
  let haveRoleStylist = false

  const findUser = await userService.findOne({
    query: {
      userId: body?.stylistId,
      status: UserStatus.ACTIVE
    },
    relations: [
      'permissions'
    ]
  })

  findUser.permissions.forEach(permission => {
    if (permission.roleName === RoleName.STYLIST) {
      haveRoleStylist = true
    }
  })

  if (!haveRoleStylist) {
    throw {
      code: 400,
      name: 'InvalidStylistID'
    }
  }

  if (newBody.stylistId === user.userId) {
    throw {
      code: 400,
      name: 'InvalidStylistID'
    }
  }

  const isAppointmentExists = await appointmentsServices.checkAppointmentExists({
    query: {
      time: newBody.time,
      stylistId: newBody.stylistId,
      customerId: user.userId
    }
  })

  if (isAppointmentExists) {
    throw {
      code: 400,
      name: 'AppointmentAlreadyExists'
    }
  }

  const isConflict = await appointmentsServices.checkAppointmentConflict({
    query: {
      time: newBody.time,
      stylistId: newBody.stylistId,
      customerId: user.userId
    }
  })

  if (isConflict) {
    throw {
      code: 400,
      name: 'AppointmentConflict'
    }
  }

  const stylist = await stylistsServices.findOneStylist({
    query: { stylistId: newBody.stylistId },
    relations: ['services']
  })

  const stylistServices = stylist.services
  const { services, errors } = await validateServiceIds(serviceIds, stylistServices);

  if (errors?.length) {

    throw {
      code: 400,
      name: 'InvalidServices',
      message: errors,
    }
  }

  const newAppointment: Appointments = await appointmentsServices.createAppointment({
    data: {
      ...newBody,
      customerId: user.userId,
      createdBy: user.userId,
    }
  });

  const newAppointmentServices = await appointmentServicesService.createAppointmentServices({
      data: {
        services,
        appointmentId: newAppointment.appointmentId,
        customerId: user.userId,
        createdBy: user.userId,
      }
    });

  newAppointment.services = newAppointmentServices

  return newAppointment
};

export const handler = lambdaFunction({
  schema: createAppointmentDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER])
  ],
  handler: createAppointment,
});
