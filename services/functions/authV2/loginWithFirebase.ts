import { LambdaFunction } from "common/types";
import { lambdaFunction } from "core/lambda";
import { FirebaseService } from "../../modules/firebases/firebases.service";
import { loginWithFirebaseDto } from "../../modules/users/users.dto";
import { UsersService } from "../../modules/users/users.service";
import { ILoginWithFirebaseResult, NextAction, UserStatus } from "../../modules/users/users.type";
import * as Jwt from 'jsonwebtoken'
import { Users } from "../../modules/users/users.entity";
import { separateName } from "../../modules/firebases/helper";

const loginWithFirebase: LambdaFunction = async (
  event,
  context
): Promise<ILoginWithFirebaseResult> => {
  const firebaseService = new FirebaseService()
  const { idToken } = event.body as any
  const userService = new UsersService()
  let user: Users
  let accessToken: string

  const { decode, provider, providerId } = await firebaseService.verifyFirebaseByIdToken(idToken)

  user = await userService.findOne({
    query: {
      providerId,
      provider
    },
    checkExist: false
  })

  if (user?.status === UserStatus.ACTIVE) {
    accessToken = Jwt.sign(
      {
        userId: user?.userId,
        phoneNumber: user?.phoneNumber,
        status: user?.status
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '90d'
      }
    )

    return {
      accessToken,
    }
  }

  const { firstName, lastName } = separateName(decode.name)
  if (!user) {
    user = await userService.create({
      data: {
        firstName,
        lastName,
        email: decode.email,
        providerId,
        provider,
        avatar: decode.picture,
        status: UserStatus.INACTIVE }
    })
  }

  accessToken = Jwt.sign(
    {
      userId: user?.userId,
      providerId: user?.providerId,
      status: user?.status,
      phoneNumber: null
    },
    process.env.JWT_SECRET_SIGN_UP,
    {
      expiresIn: '1h'
    }
  )

  return {
    accessToken,
    nextAction: NextAction.SIGNUP,
    preFillData: {
      firstName,
      lastName,
      email: decode.email
    }
  }
}

export const handler = lambdaFunction({
  schema: loginWithFirebaseDto,
  handler: loginWithFirebase,
});
