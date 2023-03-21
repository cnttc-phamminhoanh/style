import { LambdaFunction } from "common/types";
import { UsersPricingService } from "../../modules/usersPricing/usersPricing.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { getAllUserPricingDto } from "modules/usersPricing/usersPricing.dto";
import { IFindManyUserPricingResult } from "modules/usersPricing/usersPricing.type";

const getAllUserPricing: LambdaFunction = async (
  event,
  context,
): Promise<IFindManyUserPricingResult> => {

  const { queryStringParameters } = event

  const usersPricingService = new UsersPricingService()

  const usersPricing = await usersPricingService.findManyUsersPricing({
    query: {
      ...queryStringParameters,
    }
  })

  return usersPricing
}

export const handler = lambdaFunction({
  schema: getAllUserPricingDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt
  ],
  handler: getAllUserPricing
})