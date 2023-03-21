import { ICreateProposalsServices } from "modules/proposals/proposals.type";
import { Services } from "modules/services/services.entity";
import { ServiceStatus } from "modules/services/services.type";
import { IValidateServicesResult } from "./proposalsServices.type";

export function validateServices(
  services: ICreateProposalsServices[],
  stylistServices: Services[],
): IValidateServicesResult {
  if (!services?.length) {
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

  services.forEach(service => {
    const existingService = stylistServices.find(stylistService => stylistService.serviceId === service.serviceId)

    if (!existingService) {
      errors.push({
        service,
        error: `Stylist ${stylistId} does not have service ${service.serviceId}.`
      })

      return
    }

    if (existingService.status === ServiceStatus.UNABLE) {
      errors.push({
        service,
        error: `Service ${service.serviceId} is unavailable.`
      })

      return
    }

    if (service?.price) {
      existingService.price = service.price
    }

    validServices.push(existingService)

    return
  })

  return {
    services: validServices,
    errors
  }
}