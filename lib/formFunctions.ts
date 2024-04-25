import { ChangeEvent } from 'react'
import { numberWithCommas } from "@/lib/property-evaluator"

export const updateDownPayment = (e: ChangeEvent<HTMLInputElement>, downpaymentInput: HTMLInputElement, purchasePrice: number) => {
  const percentageInput = e.target
  const percentage =
    percentageInput.value ?
      +percentageInput.value / 100 :
      +percentageInput.placeholder / 100
  downpaymentInput.value = (percentage * purchasePrice).toFixed(2).toString()
};

export const updatePercentage = (e: ChangeEvent<HTMLInputElement>, percentageInput: HTMLInputElement, purchasePrice: number) => {
  const downpaymentInput = e.target
  const downpayment =
    downpaymentInput.value ?
      +downpaymentInput.value :
      +downpaymentInput.placeholder
  percentageInput.value = ((downpayment / purchasePrice) * 100).toFixed(2).toString()
};

export const updateDollarInput = (e: ChangeEvent<HTMLInputElement>, targetInput: HTMLInputElement, totalIncome: number) => {
  const percentage: number = +e.target.value / 100
  targetInput.placeholder = `$${numberWithCommas((percentage * totalIncome).toFixed(2))}`
};
