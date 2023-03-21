import { LambdaFunction } from "../../common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { TransactionsService } from "../../modules/transactions/transactions.service";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { IFindManyTransactionsResult } from "../../modules/transactions/transactions.type";
import { getManyTransactionsDto } from "../../modules/transactions/transactions.dto";

const getManyTransactions: LambdaFunction = async (
  event,
  context
): Promise<IFindManyTransactionsResult> => {
  const { user, queryStringParameters } = event as any;
  const transactionsService = new TransactionsService();

  const transactions = await transactionsService.findManyTransactions({
    query: { ...queryStringParameters },
    credentials: user,
  });

  return transactions;
};

export const handler = lambdaFunction({
  schema: getManyTransactionsDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: getManyTransactions,
});
