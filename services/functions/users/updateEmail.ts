import { lambdaFunction } from "../../core/lambda";
import { LambdaFunction } from "common/types";
import { Users } from "../../modules/users/users.entity";
import { TwilioService } from "../../modules/twilio/twilio.service";
import * as Jwt from "jsonwebtoken";
import { Auth } from "../../middleware/auth";
import { UsersService } from "../../modules/users/users.service";
import { updateEmailDto } from "../../modules/users/users.dto";
import { Not } from "typeorm";

const updateEmail: LambdaFunction = async (
  event,
  context
): Promise<{ accessToken: string }> => {
  const data = event.body as any;
  const user = event.user as Users;

  const userService = new UsersService();
  const twilioService = new TwilioService();

  if (data.newEmail === user.email) {
    throw {
      code: 400,
      name: "Old email",
    };
  }

  const existingUser = await userService.findOne({
    query: {
      email: data.newEmail,
      provider: user.provider,
      userId: Not(user.userId),
    },
    checkExist: false,
  });

  if (existingUser) {
    throw {
      code: 400,
      name: "EmailAlreadyUsed",
    };
  }

  await twilioService.sendVerificationCodeToEmail({
    email: data.newEmail,
  });

  const accessToken = Jwt.sign(
    {
      userId: user?.userId,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: data?.newEmail,
      status: user?.status,
      provider: user?.provider,
    },
    process.env.OTP_JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return {
    accessToken,
  };
};

export const handler = lambdaFunction({
  schema: updateEmailDto,
  preHandlers: [new Auth(process.env.JWT_SECRET as string).jwt],
  handler: updateEmail,
});
