import { LambdaFunction } from "common/types";
import { defaultServices } from "constant/constant";

const getOriginServices: LambdaFunction = async (
  event,
  context,
): Promise<any> => {

  return defaultServices
}

export const handler = getOriginServices