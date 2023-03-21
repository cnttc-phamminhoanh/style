import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { ServicesServices } from "../../modules/services/services.service";
import { getManyServicesDto } from "../../modules/services/services.dto";
import { IFindManyServicesResult } from "../../modules/services/services.type";

const getManyServices: LambdaFunction = async (
  event,
  context,
): Promise<IFindManyServicesResult> => {
  const query = event.queryStringParameters || { }
  const servicesServices = new ServicesServices()

  const services = await servicesServices.findManyServices({
    query
  })

  return services
}

export const handler = lambdaFunction({
  schema: getManyServicesDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt
  ],
  handler: getManyServices
})