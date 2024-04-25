import { FormEvent } from 'react'
import useSWR from 'swr'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { numberWithCommas, sum } from "@/lib/property-evaluator"
import {
  updateVacancyDollar,
  updateRepairsMaintenanceDollar,
  updateCapExDollar,
  updateManagmentFeesDollar
} from "@/lib/formFunctions"

const RentalInfo = ({ id }: { id: string }) => {

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const json = JSON.stringify({
      "RentalInfo": {
        "Income": {
          "TotalGrossMonthlyRent": Number(formData.get("totalGrossMonthlyRent")),
          "OtherMonthlyIncome": Number(formData.get("otherMonthlyIncome"))
        },
        "FixedExpenses": {
          "Electricity": Number(formData.get("electricity")),
          "WaterSewer": Number(formData.get("waterSewer")),
          "Pmi": Number(formData.get("pmiPercentage")),
          "Garbage": Number(formData.get("garbage")),
          "Hoa": Number(formData.get("hoa")),
          "MonthlyInsurance": Number(formData.get("monthlyInsurance")),
          "OtherMonthlyExpenses": Number(formData.get("otherMonthlyExpenses"))
        },
        "VariableExpenses": {
          "Vacancy": Number(formData.get("vacancy")),
          "RepairsMaintenance": Number(formData.get("repairsMaintenance")),
          "CapitalExpenditures": Number(formData.get("capitalExpenditures")),
          "ManagementFees": Number(formData.get("managementFees")),
        },
        "FutureAssumptions": {
          "IncomeGrowth": Number(formData.get("incomeGrowth")),
          "PvGrowth": Number(formData.get("pvGrowth")),
          "ExpenseGrowth": Number(formData.get("expenseGrowth")),
          "SaleExpenses": Number(formData.get("saleExpenses")),
        }
      }
    })

    await fetch(`http://localhost:9080/api/v1/properties/${id}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: json
    }).then(res => console.log(res)).catch(err => console.log(err))

  }

  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?_id=${id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0" onSubmit={onSubmit}>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Income
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="totalGrossMonthlyRent">Monthly Rent</Label>
          <Input
            id="totalGrossMonthlyRent"
            name="totalGrossMonthlyRent"
            type="number"
            placeholder={`$${numberWithCommas(data[0].RentalInfo.Income.TotalGrossMonthlyRent)}`}
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherMonthlyIncome">Other Income</Label>
          <Input id="otherMonthlyIncome" name="otherMonthlyIncome" type="number" placeholder={`$${numberWithCommas(data[0].RentalInfo.Income.OtherMonthlyIncome)}`} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Fixed Expenses
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="electricity">Electricity</Label>
          <Input id="electricity" name="electricity" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.Electricity}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="waterSewer">Water & Sewer</Label>
          <Input id="waterSewer" name="waterSewer" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.WaterSewer}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pmiPercentage">PMI</Label>
          <Input id="pmiPercentage" name="pmiPercentage" type="number" step=".01" placeholder={data[0].RentalInfo.FixedExpenses.Pmi} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="garbage">Garbage</Label>
          <Input id="garbage" name="garbage" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.Garbage}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="hoa">HOA</Label>
          <Input id="hoa" name="hoa" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.Hoa}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="monthlyInsurance">Monthly Insurance</Label>
          <Input id="monthlyInsurance" name="monthlyInsurance" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.MonthlyInsurance}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="propertyTaxes">Property Taxes</Label>
          <Input id="propertyTaxes" name="propertyTaxes" type="number" disabled={true} placeholder={numberWithCommas((data[0].RentalInfo.FixedExpenses.PropertyTaxes / 12).toFixed(2))} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherMonthlyExpenses">Other Expenses</Label>
          <Input id="otherMonthlyExpenses" name="otherMonthlyExpenses" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.OtherMonthlyExpenses}`} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Variable Expenses
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="vacancy">Vacancy</Label>
          <div className="flex">
            <Input
              id="vacancy"
              name="vacancy"
              type="number"
              min="0"
              placeholder={`${data[0].RentalInfo.VariableExpenses.Vacancy}%`}
              onChange={updateVacancyDollar} />
            <Input
              id="vacancyDollar"
              name="vacancyDollar"
              className="w-32"
              disabled={true}
              placeholder={
                `$${numberWithCommas((data[0].RentalInfo.VariableExpenses.Vacancy / 100 * sum(Object.values(data[0].RentalInfo.Income))).toFixed(2))}`
              }
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="repairsMaintenance">Repairs & Maintenance</Label>
          <div className="flex">
            <Input
              id="repairsMaintenance"
              name="repairsMaintenance"
              type="number"
              min="0"
              placeholder={`${data[0].RentalInfo.VariableExpenses.RepairsMaintenance}%`}
              onChange={updateRepairsMaintenanceDollar} />
            <Input
              id="repairsMaintenanceDollar"
              name="repairsMaintenanceDollar"
              className="w-32"
              disabled={true}
              placeholder={
                `$${numberWithCommas((data[0].RentalInfo.VariableExpenses.RepairsMaintenance / 100 * sum(Object.values(data[0].RentalInfo.Income))).toFixed(2))}`
              }
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="capitalExpenditures">Capital Expenditures</Label>
          <div className="flex">
            <Input
              id="capitalExpenditures"
              name="capitalExpenditures"
              type="number"
              min="0"
              placeholder={`${data[0].RentalInfo.VariableExpenses.CapitalExpenditures}%`}
              onChange={updateCapExDollar} />
            <Input
              id="capExDollar"
              name="capExDollar"
              className="w-32"
              disabled={true}
              placeholder={
                `$${numberWithCommas((data[0].RentalInfo.VariableExpenses.CapitalExpenditures / 100 * sum(Object.values(data[0].RentalInfo.Income))).toFixed(2))}`
              }
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="managementFees">Management Fees</Label>
          <div className="flex">
            <Input
              id="managementFees"
              name="managementFees"
              type="number"
              min="0"
              placeholder={`${data[0].RentalInfo.VariableExpenses.ManagementFees}%`}
              onChange={updateManagmentFeesDollar} />
            <Input
              id="managementFeesDollar"
              name="managementFeesDollar"
              className="w-32"
              disabled={true}
              placeholder={
                `$${numberWithCommas((data[0].RentalInfo.VariableExpenses.ManagementFees / 100 * sum(Object.values(data[0].RentalInfo.Income))).toFixed(2))}`
              }
            />
          </div>
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Future Projections
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="incomeGrowth">Income</Label>
          <Input id="incomeGrowth" name="incomeGrowth" type="number" placeholder={`${data[0].RentalInfo.FutureAssumptions.IncomeGrowth}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pvGrowth">Property Value</Label>
          <Input id="pvGrowth" name="pvGrowth" type="number" placeholder={`${data[0].RentalInfo.FutureAssumptions.PvGrowth}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="expenseGrowth">Expenses</Label>
          <Input id="expenseGrowth" name="expenseGrowth" type="number" placeholder={`${data[0].RentalInfo.FutureAssumptions.ExpenseGrowth}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="saleExpenses">Sale</Label>
          <Input id="saleExpenses" name="saleExpenses" type="number" placeholder={`${data[0].RentalInfo.FutureAssumptions.SaleExpenses}%`} />
        </div>
      </fieldset>
      <Button type="submit">Save</Button>
    </form>
  )
}

export default RentalInfo
