import { LambdaFunction } from "common/types";
import { UsersPricing } from "../../modules/usersPricing/usersPricing.entity";
import { UsersPricingService } from "../../modules/usersPricing/usersPricing.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { getOneUserPricingDto } from "modules/usersPricing/usersPricing.dto";

const getOneUserPricing: LambdaFunction = async (
  event,
  context,
): Promise<UsersPricing> => {
  const { userId } = event.pathParameters

  const usersPricingService = new UsersPricingService()

  const userPricing = await usersPricingService.findOneUsersPricing({
    query: {
      userId,
    }
  })

  return userPricing
}

export const handler = lambdaFunction({
  schema: getOneUserPricingDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt
  ],
  handler: getOneUserPricing
})