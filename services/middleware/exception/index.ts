export const handleException = (exception) => {
  const exceptionResponse = exception?.response
  const errorObject = typeof exceptionResponse === 'object' ? exceptionResponse : exception
  const statusCodes = [errorObject.status, errorObject.code, errorObject.statusCode]

  if (statusCodes.includes(401)) {
    let message = errorObject.message || errorObject.name

    return formatException({
      statusCode: 401,
      body: {
        error: 'Unauthorized',
        message,
      }
    })
  }

  if (statusCodes.includes(403)) {
    return formatException({
      statusCode: 403,
      body: {
        error: errorObject.name || 'Forbidden',
        message: errorObject.message || errorObject.name,
      },
    })
  }

  if (statusCodes.includes(404)) {
    return formatException({
      statusCode: 404,
      body: {
        error: errorObject.name || 'Not found',
        message: errorObject.message || errorObject.name,
      },
    })
  }

  if (statusCodes.includes(400)) {
    return formatException({
      statusCode: 400,
      body: {
        error: errorObject.name ||  'Bad request',
        message: errorObject.message || errorObject.name,
      },
    })
  }

  return formatException({
    statusCode: 500,
    body: {
      error: 'Internal server error',
      message: `${errorObject.message} - ${errorObject.stack}`,
    }
  })
}

function formatException (exception) {
  return {
    statusCode: exception.statusCode,
    body: JSON.stringify(exception.body),
    headers: {
      "Content-Type": 'application/json'
    }
  }
}