import { LambdaFunction } from "../../common/types";
import { getManyPaymentMethodsDto } from "../../modules/paymentMethods/paymentMethods.dto";
import { PaymentMethodsService } from "../../modules/paymentMethods/paymentMethods.service";
import { IFindManyPaymentMethodsResult } from "../../modules/paymentMethods/paymentMethods.type";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";

const getManyPaymentMethods: LambdaFunction = async (
  event,
  context
): Promise<IFindManyPaymentMethodsResult> => {
  const { user, queryStringParameters } = event as any;
  const paymentMethodsService = new PaymentMethodsService();

  const paymentMethods = await paymentMethodsService.findManyPaymentMethods({
    query: { ...queryStringParameters },
    credentials: user,
  });

  return paymentMethods;
};

export const handler = lambdaFunction({
  schema: getManyPaymentMethodsDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER]),
  ],
  handler: getManyPaymentMethods,
});
