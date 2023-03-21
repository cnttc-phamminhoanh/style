import { LambdaFunction } from "../../common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { PaymentsService } from "../../modules/payments/payments.service";
import { Payments } from "../../modules/payments/payments.entity";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { getOnePaymentDto } from "../../modules/payments/payments.dto";

const getOnePayment: LambdaFunction = async (
  event,
  context
): Promise<Payments> => {
  const { user, pathParameters } = event;
  const paymentsServices = new PaymentsService();

  const payment = await paymentsServices.findOnePayment({
    query: {
      paymentId: pathParameters.paymentId,
    },
    credentials: user,
  });

  return payment;
};

export const handler = lambdaFunction({
  schema: getOnePaymentDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: getOnePayment,
});
