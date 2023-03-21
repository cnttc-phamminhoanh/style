import { LambdaFunction } from "common/types"
import { Users } from '../../modules/users/users.entity'
import { Auth } from '../../middleware/auth'
import { lambdaFunction } from "core/lambda"
import { UsersService } from '../../modules/users/users.service'
import { checkRole } from '../../middleware/authz'

const getUserProfile: LambdaFunction =  async (
    event,
    context,
  ): Promise<Users> => {
    const user = event.user as Users
    const userService = new UsersService()

    const profile = await userService.findOne({
      query: { userId: user.userId },
      relations: ['permissions']
    })

    return profile
  }

  export const handler = lambdaFunction({
    preHandlers: [
      new Auth(process.env.JWT_SECRET as string).jwt,
      checkRole([])
    ],
    handler: getUserProfile
  })