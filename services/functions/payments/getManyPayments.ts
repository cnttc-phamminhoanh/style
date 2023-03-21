import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { PaymentsService } from "../../modules/payments/payments.service";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { IFindManyPaymentsResult } from "../../modules/payments/payments.type";
import { getManyPaymentsDto } from "../../modules/payments/payments.dto";

const getManyPayments: LambdaFunction = async (
  event,
  context
): Promise<IFindManyPaymentsResult> => {
  const { user, queryStringParameters } = event as any;
  const paymentsService = new PaymentsService();

  const payments = await paymentsService.findManyPayments({
    query: { ...queryStringParameters },
    credentials: user,
  });

  return payments;
};

export const handler = lambdaFunction({
  schema: getManyPaymentsDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: getManyPayments,
});
