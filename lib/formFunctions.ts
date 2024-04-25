import { ChangeEvent } from 'react'
import { numberWithCommas, sum } from "@/lib/property-evaluator"

export const updateVacancyDollar = (e: ChangeEvent<HTMLInputElement>) => {
  const percentage = +e.target.value / 100

  const rentalIncomeInput = document.getElementById("totalGrossMonthlyRent") as HTMLInputElement
  const rentalIncome: number =
    rentalIncomeInput.value ?
      +rentalIncomeInput.value :
      +rentalIncomeInput.placeholder.split('$')[1].replace(',', '')

  const otherIncomeInput = document.getElementById("otherMonthlyIncome") as HTMLInputElement
  const otherIncome: number =
    otherIncomeInput.value ?
      +otherIncomeInput.value :
      +otherIncomeInput.placeholder.split('$')[1].replace(',', '')

  const vacancyDollar = document.getElementById("vacancyDollar") as HTMLInputElement

  const totalIncome = sum([rentalIncome, otherIncome])
  vacancyDollar.placeholder = `$${numberWithCommas((percentage * totalIncome).toFixed(2))}`
};

export const updateRepairsMaintenanceDollar = (e: ChangeEvent<HTMLInputElement>) => {
  const percentage = +e.target.value / 100

  const rentalIncomeInput = document.getElementById("totalGrossMonthlyRent") as HTMLInputElement
  const rentalIncome: number =
    rentalIncomeInput.value ?
      +rentalIncomeInput.value :
      +rentalIncomeInput.placeholder.split('$')[1].replace(',', '')

  const otherIncomeInput = document.getElementById("otherMonthlyIncome") as HTMLInputElement
  const otherIncome: number =
    otherIncomeInput.value ?
      +otherIncomeInput.value :
      +otherIncomeInput.placeholder.split('$')[1].replace(',', '')

  const repairsMaintenanceDollar = document.getElementById("repairsMaintenanceDollar") as HTMLInputElement

  const totalIncome = sum([rentalIncome, otherIncome])
  repairsMaintenanceDollar.placeholder = `$${numberWithCommas((percentage * totalIncome).toFixed(2))}`
};

export const updateCapExDollar = (e: ChangeEvent<HTMLInputElement>) => {
  const percentage = +e.target.value / 100

  const rentalIncomeInput = document.getElementById("totalGrossMonthlyRent") as HTMLInputElement
  const rentalIncome: number =
    rentalIncomeInput.value ?
      +rentalIncomeInput.value :
      +rentalIncomeInput.placeholder.split('$')[1].replace(',', '')

  const otherIncomeInput = document.getElementById("otherMonthlyIncome") as HTMLInputElement
  const otherIncome: number =
    otherIncomeInput.value ?
      +otherIncomeInput.value :
      +otherIncomeInput.placeholder.split('$')[1].replace(',', '')

  const capExDollar = document.getElementById("capExDollar") as HTMLInputElement

  const totalIncome = sum([rentalIncome, otherIncome])
  capExDollar.placeholder = `$${numberWithCommas((percentage * totalIncome).toFixed(2))}`
};

export const updateManagmentFeesDollar = (e: ChangeEvent<HTMLInputElement>) => {
  const percentage = +e.target.value / 100

  const rentalIncomeInput = document.getElementById("totalGrossMonthlyRent") as HTMLInputElement
  const rentalIncome: number =
    rentalIncomeInput.value ?
      +rentalIncomeInput.value :
      +rentalIncomeInput.placeholder.split('$')[1].replace(',', '')

  const otherIncomeInput = document.getElementById("otherMonthlyIncome") as HTMLInputElement
  const otherIncome: number =
    otherIncomeInput.value ?
      +otherIncomeInput.value :
      +otherIncomeInput.placeholder.split('$')[1].replace(',', '')

  const managementFeesDollar = document.getElementById("managementFeesDollar") as HTMLInputElement

  const totalIncome = sum([rentalIncome, otherIncome])
  managementFeesDollar.placeholder = `$${numberWithCommas((percentage * totalIncome).toFixed(2))}`
};
