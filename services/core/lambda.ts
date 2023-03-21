import { Handle, HTTPSuccessCode, LambdaFunction, Method } from "../common/types"
import { validateDto } from "../middleware/dto"
import { handleException } from "../middleware/exception"
import { DatabaseConnection } from './database'

export const lambdaFunction = ({
  schema,
  preHandlers = [],
  handler,
}: Handle): LambdaFunction => {
  return async (event, context) => {
    try {
      // connection to database
      await new DatabaseConnection().getConnection()

      if (schema) {
        const validData = validateDto(schema, {
          headers: event.headers,
          body: event.body ? JSON.parse(event.body) : null,
          queryStringParameters: event.queryStringParameters,
          pathParameters: event.pathParameters
        })

        event = { ...event, ...validData }
      }

      for (let i = 0; i < preHandlers.length ; i ++) {
        const assignedValue = await preHandlers[i](event, context)

        if (assignedValue) {
          if (typeof assignedValue === 'object') {
            event = { ...event, ...assignedValue }

            continue
          }

          event[`assignedValue${i}`] = assignedValue
        }
      }

      let response = await handler(event, context)

      if (typeof response !== 'string') {
        response = JSON.stringify(response)
      }

      const httpMethod = event.requestContext.http.method

      const successCode = HTTPSuccessCode[httpMethod?.toUpperCase() as Method]

      return {
        statusCode: successCode,
        body: response,
        headers: {
          "Content-Type": 'application/json'
        }
      }
    } catch (error) {
      return handleException(error)
    }
  }
}