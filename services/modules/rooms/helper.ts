import { Users } from "../../modules/users/users.entity";
import { IValidateUserIdsResult } from "./rooms.type";

export function validateUserIds(
  userIds: string[],
  users: Users[],
): IValidateUserIdsResult {
  if (!userIds?.length) {

    return {
      userIds: [],
      errors: []
    }
  }

  if (!users?.length) {
    throw {
      code: 404,
      name: 'UsersNotFound'
    }
  }

  const validUserIds = []
  const errors = []

  userIds.forEach(userId => {
    const existingUser = users.find(user => user.userId === userId)

    if (!existingUser) {
      errors.push({
        userId,
        error: `User ${userId} not found`
      })

      return
    }

    validUserIds.push(userId)

    return
  })

  return {
    userIds: validUserIds,
    errors
  }
}