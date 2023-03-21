import { LambdaFunction } from "common/types";
import { UsersPricing } from "../../modules/usersPricing/usersPricing.entity";
import { UsersPricingService } from "../../modules/usersPricing/usersPricing.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { createUsersPricingDto } from "../../modules/usersPricing/usersPricing.dto";
import { checkRole } from '../../middleware/authz';
import { PermissionStatus, RoleName } from '../../modules/permissions/permissions.type'

const createUserPricing: LambdaFunction = async (
  event,
  context,
): Promise<UsersPricing> => {
  const { user, body } = event as any

  const usersPricingService = new UsersPricingService()

  const userPricing = await usersPricingService.findOneUsersPricing({
    query: {
      userId: user.userId,
    },
    checkExist: false,
  })

  if (userPricing) {
    throw {
      code: 400,
      name: 'UserPricingAlreadyExists',
    }
  }

  const newUserPricing = await usersPricingService.createUsersPricing({
    data: {
      ...body,
      userId: user.userId,
    }
  })

  return newUserPricing
}

export const handler = lambdaFunction({
  schema: createUsersPricingDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([{ roleName: RoleName.STYLIST, status: [PermissionStatus.PENDING, PermissionStatus.ACTIVE] }])
  ],
  handler: createUserPricing
})