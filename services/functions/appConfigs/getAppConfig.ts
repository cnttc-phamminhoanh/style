import AWS from "aws-sdk";
import { Json } from "aws-sdk/clients/robomaker";
import { LambdaFunction } from "common/types";
import { lambdaFunction } from "../../core/lambda";

const getAppConfig: LambdaFunction = async (
  event,
  context
): Promise<Json> => {
  const appConfig = new AWS.AppConfig()
  const params = {
    ApplicationId: process.env.AWS_APPCONFIG_APPLICATION_ID,
    ConfigurationProfileId: process.env.AWS_APPCONFIG_CONFIGURATION_PROFILE_ID
  }

  const data = await appConfig.getConfigurationProfile(params).promise()

  const content = JSON.parse(data.Validators[0].Content)

  return content
};

export const handler = lambdaFunction({
  handler: getAppConfig,
});
