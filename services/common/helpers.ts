import { Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";

export const buildFilterInRange = (fromValue, toValue) => {
  if (fromValue && toValue) {
    return Between(fromValue, toValue)
  }

  if (fromValue) {
    return MoreThanOrEqual(fromValue)
  }

  if (toValue) {
    return LessThanOrEqual(toValue)
  }

  return undefined
}