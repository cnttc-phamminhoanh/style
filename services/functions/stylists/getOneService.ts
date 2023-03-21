import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from '../../middleware/auth';
import { Services } from "modules/services/services.entity";
import { ServicesServices } from "../../modules/services/services.service";
import { getOneServiceDto } from "../../modules/services/services.dto";

const getOneService: LambdaFunction = async (
  event,
  context,
): Promise<Services> => {
  const { serviceId } = event.pathParameters

  const servicesServices = new ServicesServices()

  const service = await servicesServices.findOneService({
    query: {
      serviceId,
    }
  })

  return service
}

export const handler = lambdaFunction({
  schema: getOneServiceDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt
  ],
  handler: getOneService
})