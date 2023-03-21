import { updateProfileDto } from "../../modules/users/users.dto";
import { lambdaFunction } from '../../core/lambda'
import { LambdaFunction } from "common/types";
import { UsersService } from "../../modules/users/users.service";
import { Auth } from '../../middleware/auth'
import { Users } from '../../modules/users/users.entity'


const updateProfile: LambdaFunction = async (
  event,
  context,
) => {
  const data = event.body as any

  const user = event.user as Users

  const mapData = {
    ...data,
    address: data?.location?.address,
    latitude: data?.location?.latitude,
    longitude: data?.location?.longitude,
  }

  delete mapData?.location

  const userService = new UsersService()

  const updateUser = await userService.update({
    query: {
      userId: user.userId,
    },
    data: mapData,
  })

  return updateUser
}

export const handler = lambdaFunction({
  schema: updateProfileDto,
  preHandlers: [
    new Auth(process.env.JWT_SECRET as string).jwt
  ],
  handler: updateProfile,
})
