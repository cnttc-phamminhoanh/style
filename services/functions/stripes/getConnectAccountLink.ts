import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";
import { Auth } from "../../middleware/auth";
import { checkRole } from "../../middleware/authz";
import { RoleName } from "../../modules/permissions/permissions.type";
import { StripesService } from "modules/stripes/stripes.service";
import { getAccountLinkDto } from "modules/stripes/stripes.dto";
import { ConnectedAccountService } from "modules/connectedAccounts/connectedAccounts.service";
import { ConnectedAccountsStatus, ConnectedAccountsType, ICreateConnectAccountLinkResult } from "modules/connectedAccounts/connectedAccounts.type";
import { ConnectAccountBusinessType, ConnectAccountCountry, ConnectAccountLinkType } from "constant/constant";

const createAccountLink: LambdaFunction = async (
  event,
  context
): Promise<ICreateConnectAccountLinkResult> => {
  const { refreshUrl, returnUrl } = event.body as any
  const stripesService = new StripesService()
  const connectedAccountService = new ConnectedAccountService()

  const { hasConnectedAccount, status } = await connectedAccountService.checkConnectedAccount({
    query: {
      stylistId: event.user.userId
    }
  })

  if (hasConnectedAccount) {
    throw {
      code: 400,
      name: 'StylistAlreadyHasConnectedAccount'
    }
  }

  const { connectAccountLink, connectAccountId } = await stripesService.createAccountLink({
    data: {
      refreshUrl,
      returnUrl,
      connectAccountType: ConnectedAccountsType.EXPRESS,
      connectAccountBusinessType: ConnectAccountBusinessType.INDIVIDUAL,
      connectAccountCountry: ConnectAccountCountry.UNITED_STATES,
      connectAccountLinkType: ConnectAccountLinkType.ACCOUNT_ONBOARDING,
    }
  })

  if (status && status !== ConnectedAccountsStatus.ACTIVE) {
    await connectedAccountService.updateConnectedAccount({
      data: {
        stripeConnectedAccountId: connectAccountId,
        type: ConnectedAccountsType.EXPRESS,
        status: ConnectedAccountsStatus.CONNECTING
      },
      query: { stylistId: event.user.userId }
    })

    return { connectAccountLink }
  }

  await connectedAccountService.createConnectedAccount({
    data: {
      stylistId: event.user.userId,
      stripeConnectedAccountId: connectAccountId,
      type: ConnectedAccountsType.EXPRESS,
      status: ConnectedAccountsStatus.CONNECTING
    }
  })

  return { connectAccountLink }
}

export const handler = lambdaFunction({
  schema: getAccountLinkDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt,
    checkRole([RoleName.STYLIST]),
  ],
  handler: createAccountLink,
});
