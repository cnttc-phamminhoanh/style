import { LambdaFunction } from "common/types";
import { getOnePaymentMethodDto } from "../../modules/paymentMethods/paymentMethods.dto";
import { PaymentMethods } from "../../modules/paymentMethods/paymentMethods.entity";
import { PaymentMethodsService } from "../../modules/paymentMethods/paymentMethods.service";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";

const getOnePaymentMethod: LambdaFunction = async (
  event,
  context
): Promise<PaymentMethods> => {
  const { user, pathParameters } = event;
  const PaymentMethodsServices = new PaymentMethodsService();

  const paymentMethod = await PaymentMethodsServices.findOnePaymentMethod({
    query: {
      paymentMethodId: pathParameters.paymentMethodId,
    },
    credentials: user,
  });

  return paymentMethod;
};

export const handler = lambdaFunction({
  schema: getOnePaymentMethodDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.CUSTOMER]),
  ],
  handler: getOnePaymentMethod,
});
