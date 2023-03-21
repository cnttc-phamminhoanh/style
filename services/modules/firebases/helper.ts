export const getNextCursor = ({ data, sortBy = 'messageId', limit }) => {
  const firstElement = data[0]
  let nextCursor = 'END'

  if (data.length) {
    let cursor = firstElement[sortBy]

    if (typeof cursor === 'object' && cursor[sortBy]) {
      cursor = cursor[sortBy]
    }
    nextCursor = cursor
  }

  if (data.length === 0 || data.length < limit) {
    nextCursor = 'END'
  }

  return nextCursor
}

export function separateName(
  fullName: string
): { firstName: string, lastName?: string } {
  const fullNameArr = fullName.split(' ')

  if (fullNameArr.length < 1) {
    return { firstName: fullName }
  }

  const lastName = fullNameArr.pop()
  const  firstName = fullNameArr.join(' ')

  return { firstName, lastName };
}