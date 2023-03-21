import { LambdaFunction } from "../../common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { TransactionsService } from "../../modules/transactions/transactions.service";
import { Transactions } from "../../modules/transactions/transactions.entity";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { getOneTransactionDto } from "../../modules/transactions/transactions.dto";

const getOneTransaction: LambdaFunction = async (
  event,
  context
): Promise<Transactions> => {
  const { user, pathParameters } = event;
  const transactionsServices = new TransactionsService();

  const transaction = await transactionsServices.findOneTransaction({
    query: {
      transactionId: pathParameters.transactionId,
    },
    credentials: user,
  });

  return transaction;
};

export const handler = lambdaFunction({
  schema: getOneTransactionDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST, RoleName.CUSTOMER]),
  ],
  handler: getOneTransaction,
});
