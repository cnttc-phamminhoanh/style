import { Services } from "./services.entity";

export function mergeServices(
  oldServices: Services[],
  newServices: Services[],
  stylistId: string
): Services[] {
  const mappedObjectOldServices: { [key: string]: any } = {};
  const mappedObjectNewServices: { [key: string]: any } = {};

  oldServices.forEach((each) => {
    mappedObjectOldServices[each.serviceName] = each;
  });

  newServices.forEach((each) => {
    mappedObjectNewServices[each.serviceName] = each;
  });

  const mappedPayload = {
    ...mappedObjectOldServices,
    ...mappedObjectNewServices,
  };

  const serviceNames = Object.keys(mappedPayload);

  const mergedServices: any[] = serviceNames.map((serviceName) => {
    if (!mappedObjectNewServices[serviceName]) {
      mappedObjectNewServices[serviceName] = {};
    }

    if (!mappedObjectOldServices[serviceName]) {
      mappedObjectOldServices[serviceName] = {};
    }
    return {
      ...mappedObjectOldServices[serviceName],
      ...mappedObjectNewServices[serviceName],
      stylistId,
    };
  });

  return mergedServices;
}
