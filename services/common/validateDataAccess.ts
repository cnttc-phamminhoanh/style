import { Credentials } from '../common/types'

type Data = { [key: string]: any }

const canAccess = (user: Credentials, data: Data, authorizeKey?: string): boolean => {
  if (!data || Object.keys(data).length === 0) {
    return true
  }

  if (user?.isPublic) {
    return true
  }

  const authorizeData = [
    data?.userId,
    data?.stylistId,
    data?.customerId,
    data?.createdBy,
    data?.sender,
	  data?.receiver
  ]

  let passed

  if (!authorizeKey) {
    passed = authorizeData.some(value => {
      return typeof value === 'object' ? value?.userId === user.userId : value === user.userId
    })
  }

  if (authorizeKey) {
    const value = data[authorizeKey]

    passed = typeof value === 'object' ? value?.userId === user.userId : value === user.userId
  }

  return passed
}

export const validateDataAccessToArray = (user: Credentials, data: Data[], authorizeKey?: string): Data[] => {
  if (user?.isPublic) {
    return data
  }

  if (!user?.permissions?.length) {
    throw {
      statusCode: 403,
      name: 'Forbidden',
      message: `You don't have permission to access`
    }
  }

  const result = data.map(each => canAccess(user, each, authorizeKey) ? each : null)

  return result
}

export const validateDataAccessToObject = (user: Credentials, data: Data, authorizeKey?: string): Data => {
  if (user?.isPublic) {
    return data
  }

  if (!user?.permissions?.length) {
    throw {
      statusCode: 403,
      name: 'Forbidden',
      message: `You don't have permission to access`
    }
  }

  const passed = canAccess(user, data, authorizeKey)

  if (!passed) {
    throw {
      statusCode: 403,
      name: 'Forbidden',
      message: `Access validation error`
    }
  }

  return data
}