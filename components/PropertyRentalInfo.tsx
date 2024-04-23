import { FormEvent } from 'react'
import useSWR from 'swr'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { numberWithCommas} from "@/lib/property-evaluator"

const RentalInfo = ({ id }: {id: string}) => {

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
          <Input name="totalGrossMonthlyRent" type="number" placeholder={`$${numberWithCommas(data[0].RentalInfo.Income.TotalGrossMonthlyRent)}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherMonthlyIncome">Other Income</Label>
          <Input name="otherMonthlyIncome" type="number" placeholder={`$${numberWithCommas(data[0].RentalInfo.Income.OtherMonthlyIncome)}`} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Fixed Expenses
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="role">Electricity</Label>
          <Input name="electricity" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.Electricity}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="waterSewer">Water & Sewer</Label>
          <Input name="waterSewer" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.WaterSewer}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pmiPercentage">PMI</Label>
          <Input name="pmiPercentage" type="number" step=".01" placeholder={data[0].RentalInfo.FixedExpenses.Pmi} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="garbage">Garbage</Label>
          <Input name="garbage" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.Garbage}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="hoa">HOA</Label>
          <Input name="hoa" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.Hoa}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="monthlyInsurance">Monthly Insurance</Label>
          <Input name="monthlyInsurance" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.MonthlyInsurance}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="propertyTaxes">Property Taxes</Label>
          <Input name="propertyTaxes" type="number" disabled={true} placeholder={numberWithCommas((data[0].RentalInfo.FixedExpenses.PropertyTaxes/12).toFixed(2))} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherMonthlyExpenses">Other Expenses</Label>
          <Input name="otherMonthlyExpenses" type="number" placeholder={`$${data[0].RentalInfo.FixedExpenses.OtherMonthlyExpenses}`} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Variable Expenses
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="vacancy">Vacancy</Label>
          <Input name="vacancy" type="number" placeholder={`${data[0].RentalInfo.VariableExpenses.Vacancy}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="repairsMaintenance">Repairs & Maintenance</Label>
          <Input name="repairsMaintenance" type="number" placeholder={`${data[0].RentalInfo.VariableExpenses.RepairsMaintenance}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="capitalExpenditures">Capital Expenditures</Label>
          <Input name="capitalExpenditures" type="number" placeholder={`${data[0].RentalInfo.VariableExpenses.CapitalExpenditures}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="managementFees">Management Fees</Label>
          <Input name="managementFees" type="number" placeholder={`${data[0].RentalInfo.VariableExpenses.ManagementFees}%`} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Future Projections
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="incomeGrowth">Income</Label>
          <Input name="incomeGrowth" type="number" placeholder={`${data[0].RentalInfo.FutureAssumptions.IncomeGrowth}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pvGrowth">Property Value</Label>
          <Input name="pvGrowth" type="number" placeholder={`${data[0].RentalInfo.FutureAssumptions.PvGrowth}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="expenseGrowth">Expenses</Label>
          <Input name="expenseGrowth" type="number" placeholder={`${data[0].RentalInfo.FutureAssumptions.ExpenseGrowth}%`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="saleExpenses">Sale</Label>
          <Input name="saleExpenses" type="number" placeholder={`${data[0].RentalInfo.FutureAssumptions.SaleExpenses}%`} />
        </div>
      </fieldset>
      <Button type="submit">Save</Button>
    </form>
  )
}

export default RentalInfo
