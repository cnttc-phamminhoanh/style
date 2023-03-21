import { percentageFeeOnGrossAmount } from "constant/constant"

interface ICalculateGrossAmountFeeAndNetAmountData {
  amount: number
  discount: number
  tip: number
}

interface ICalculateGrossAmountFeeAndNetAmountResult {
  grossAmount: number
  netAmount: number
  fee: number
  tip: number
  discount: number
}

export const calculatePaymentAmount = ({
  amount,
  tip = 0,
  discount = 0
}: ICalculateGrossAmountFeeAndNetAmountData): ICalculateGrossAmountFeeAndNetAmountResult => {
  const grossAmount = amount

  const fee = grossAmount * percentageFeeOnGrossAmount / 100

  const netAmount = grossAmount + fee - discount + tip

  return {
    grossAmount: formatDecimalNumber(grossAmount),
    fee: formatDecimalNumber(fee),
    netAmount: formatDecimalNumber(netAmount),
    tip: formatDecimalNumber(tip),
    discount: formatDecimalNumber(discount)
  }
}

export const formatDecimalNumber = (value: number) => {
  if (!value) {
    return value
  }

  const roundValue = value.toFixed(2)

  return Number(roundValue)
}

export const formatAmount = {
  to: formatDecimalNumber,
  from: formatDecimalNumber
}