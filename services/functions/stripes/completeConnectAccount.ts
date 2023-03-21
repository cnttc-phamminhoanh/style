import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { StripesService } from "modules/stripes/stripes.service";
import { ConnectedAccountService } from "modules/connectedAccounts/connectedAccounts.service";
import { ConnectedAccountsStatus } from "modules/connectedAccounts/connectedAccounts.type";

const completeConnectAccount: LambdaFunction = async (
  event,
  context
): Promise<boolean> => {
  const stripesService = new StripesService()
  const connectedAccountService = new ConnectedAccountService()

  const connectedAccount = await connectedAccountService.findOneConnectedAccount({
    query: {
      stylistId: event.user.userId
    }
  })

  if (connectedAccount.status === ConnectedAccountsStatus.ACTIVE) {
    throw {
      code: 400,
      name: 'ConnectedAccountAlreadyActive'
    }
  }

  await stripesService.findOneAccount({
    query: {
      stripeConnectedAccountId: connectedAccount.stripeConnectedAccountId
    }
  })

  return await connectedAccountService.updateConnectedAccount({
    query: { stylistId: event.user.userId },
    data: { status: ConnectedAccountsStatus.ACTIVE }
  })
}

export const handler = lambdaFunction({
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: completeConnectAccount,
});
