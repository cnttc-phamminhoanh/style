import { Services } from "modules/services/services.entity";
import { ServiceStatus } from "modules/services/services.type";
import { IValidateServiceIdsResult } from "./appointmentServices.type";

export function validateServiceIds(
  serviceIds: string[],
  stylistServices: Services[],
): IValidateServiceIdsResult {
  if (!serviceIds?.length) {
    return {
      services: [],
      errors: []
    }
  }

  if (!stylistServices?.length) {
    throw {
      code: 400,
      name: 'Stylist dose not have any service.'
    }
  }

  const validServices = []
  const errors = []
  const stylistId = stylistServices[0]?.stylistId

  serviceIds.forEach(serviceId => {
    const existingService = stylistServices.find(stylistService => stylistService.serviceId === serviceId)

    if (!existingService) {
      errors.push({
        serviceId,
        error: `Stylist ${stylistId} does not have service ${serviceId}.`
      })

      return
    }

    if (existingService.status === ServiceStatus.UNABLE) {
      errors.push({
        serviceId,
        error: `Service ${serviceId} is unavailable.`
      })

      return
    }

    validServices.push(existingService)

    return
  })

  return {
    services: validServices,
    errors
  }
}