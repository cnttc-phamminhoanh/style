import { LambdaFunction } from "common/types";
import { Stylists } from "../../modules/stylists/stylists.entity";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName, PermissionStatus } from "../../modules/permissions/permissions.type";
import { StylistsServices } from "../../modules/stylists/stylists.service";
import { ServicesServices } from "../../modules/services/services.service";
import { createServiceDto } from "../../modules/services/services.dto";

const setPricing: LambdaFunction = async (
  event,
  context
): Promise<Stylists> => {
  const { user, body } = event as any;
  const stylistsServices = new StylistsServices();
  const servicesServices = new ServicesServices();

  const stylist = await stylistsServices.getOrCreateOneStylist({
    query: { stylistId: user.userId },
    relations: [
      'services'
    ]
  })

  await stylistsServices.updateStylist({
    stylistId: stylist.stylistId ,
    data: { flexibility: body.flexibility }
  });

  if (!stylist?.services?.length) {
    const newServices = await servicesServices.createService({
      data: {
        services: body.services,
        stylistId: stylist.stylistId,
      },
    });

    stylist.services = newServices

    return stylist
  }

  const newService = await servicesServices.updateServices({
    data: {
      services: body.services,
      stylist
    }
  });

  stylist.services = newService
  stylist.flexibility = body.flexibility

  return stylist
};

export const handler = lambdaFunction({
  schema: createServiceDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([{ roleName: RoleName.STYLIST, status: [PermissionStatus.PENDING, PermissionStatus.ACTIVE] }])
  ],
  handler: setPricing,
});
