import { LambdaFunction } from "common/types";
import { UsersPricingService } from "../../modules/usersPricing/usersPricing.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { updateUsersPricingDto } from "../../modules/usersPricing/usersPricing.dto";
import { checkRole } from "../../middleware/authz";
import { PermissionStatus, RoleName } from "../../modules/permissions/permissions.type";

const updateUserPricing: LambdaFunction = async (
  event,
  context,
): Promise<boolean> => {
  const { user, body } = event as any

  const usersPricingService = new UsersPricingService()

  const updateUserPricing = await usersPricingService.updateUsersPricing({
    query: {
      userId: user.userId,
    },
    data: body,
  })

  return updateUserPricing
}

export const handler = lambdaFunction({
  schema: updateUsersPricingDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([{ roleName: RoleName.STYLIST, status: [PermissionStatus.ACTIVE, PermissionStatus.PENDING] }])
  ],
  handler: updateUserPricing
})