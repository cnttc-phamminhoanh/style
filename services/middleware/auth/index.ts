import { JwtPayload, verify } from 'jsonwebtoken'
import { UsersService } from '../../modules/users/users.service'

export class Auth {

  constructor(readonly secret: string) { }

  jwt = async (event , context) => {
    const authorization = event?.headers?.authorization || ''
    const token = authorization?.split(' ')[1]

    if (!this.secret) {
      throw new Error('JWT_SECRET needs to be set')
    }

    const userService = new UsersService()
    const decoded = await this.verifyAsync(token, this.secret)
    const user = await userService.findOne({
      query: { userId: decoded.userId },
      checkExist: true,
      relations: ['permissions']
    })

    if(user?.phoneNumber !== decoded.phoneNumber) {
      throw {
        statusCode: 401,
        name: 'UnAuthorization',
        message: 'Invalid token'
      }
    }

    event.user = user
  }

  jwtUpdatePhoneNumber = async (event , context) => {
    const authorization = event?.headers?.authorization || ''
    const token = authorization?.split(' ')[1]

    if (!this.secret) {
      throw new Error('JWT_SECRET needs to be set')
    }

    const userService = new UsersService()
    const decoded = await this.verifyAsync(token, this.secret)
    const user = await userService.findOne({
      query: { userId: decoded.userId },
      checkExist: true,
    })

    user.phoneNumber = decoded.phoneNumber

    event.user = user
  }

  jwtUpdateEmail = async (event , context) => {
    const authorization = event?.headers?.authorization || ''
    const token = authorization?.split(' ')[1]

    if (!this.secret) {
      throw new Error('JWT_SECRET needs to be set')
    }

    const userService = new UsersService()
    const decoded = await this.verifyAsync(token, this.secret)
    const user = await userService.findOne({
      query: { userId: decoded.userId },
      checkExist: true,
    })

    user.email = decoded.email

    event.user = user
  }

  private verifyAsync(token = '', secret: string): Promise<JwtPayload> {
    return new Promise( (resolve, reject)  => {
      verify(token, secret, (err, decoded) => {
        if (err) return reject({
          statusCode: 401,
          name: 'UnAuthorization',
          message: 'Invalid token'
        })

        if (!decoded) return reject({
          statusCode: 401,
          name: 'UnAuthorization',
          message: 'There is something wrong with token'
        })

        return resolve(decoded as JwtPayload)
      })
  })}
}
