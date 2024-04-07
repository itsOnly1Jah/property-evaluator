import { Property } from '@/types'
import useSWR from 'swr'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const RentalInfo = ({ id }) => {
  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?_id=${id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Income
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="totalGrossMonthlyRent">Monthly Rent</Label>
          <Input id="totalGrossMonthlyRent" type="number" placeholder={data[0].RentalInfo.Income.TotalGrossMonthlyRent} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherMonthlyIncome">Other Income</Label>
          <Input id="otherMonthlyIncome" type="number" placeholder={data[0].RentalInfo.Income.OtherMonthlyIncome} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Fixed Expenses
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="role">Electricity</Label>
          <Input id="electricity" type="number" placeholder={data[0].RentalInfo.FixedExpenses.Electricity} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="waterSewer">Water & Sewer</Label>
          <Input id="waterSewer" type="number" placeholder={data[0].RentalInfo.FixedExpenses.WaterSewer} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pmiPercentage">PMI</Label>
          <Input id="pmiPercentage" type="number" placeholder={data[0].RentalInfo.FixedExpenses.PmiPercentage} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="garbage">Garbage</Label>
          <Input id="garbage" type="number" placeholder={data[0].RentalInfo.FixedExpenses.Garbage} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="hoa">HOA</Label>
          <Input id="hoa" type="number" placeholder={data[0].RentalInfo.FixedExpenses.HOA} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="monthlyInsurance">Monthly Insurance</Label>
          <Input id="monthlyInsurance" type="number" placeholder={data[0].RentalInfo.FixedExpenses.MonthlyInsurance} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="propertyTaxes">Property Taxes</Label>
          <Input id="propertyTaxes" type="number" placeholder={data[0].RentalInfo.FixedExpenses.PropertyTaxes} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherMonthlyExpenses">Other Expenses</Label>
          <Input id="otherMonthlyExpenses" type="number" placeholder={data[0].RentalInfo.FixedExpenses.OtherMonthlyExpenses} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Variable Expenses
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="vacancy">Vacancy</Label>
          <Input id="vacancy" type="number" placeholder={data[0].RentalInfo.VariableExpenses.Vacancy} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="repairsMaintenance">Repairs & Maintenance</Label>
          <Input id="repairsMaintenance" type="number" placeholder={data[0].RentalInfo.VariableExpenses.RepairsMaintenance} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="capitalExpenditures">Capital Expenditures</Label>
          <Input id="capitalExpenditures" type="number" placeholder={data[0].RentalInfo.VariableExpenses.CapitalExpenditures} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="managementFees">Management Fees</Label>
          <Input id="managementFees" type="number" placeholder={data[0].RentalInfo.VariableExpenses.ManagementFees} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Future Projections
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="incomeGrowth">Income</Label>
          <Input id="incomeGrowth" type="number" placeholder={data[0].RentalInfo.FutureAssumptions.IncomeGrowth} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pvGrowth">Property Value</Label>
          <Input id="pvGrowth" type="number" placeholder={data[0].RentalInfo.FutureAssumptions.PvGrowth} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="expenseGrowth">Expenses</Label>
          <Input id="expenseGrowth" type="number" placeholder={data[0].RentalInfo.FutureAssumptions.ExpenseGrowth} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="saleExpenses">Sale</Label>
          <Input id="saleExpenses" type="number" placeholder={data[0].RentalInfo.FutureAssumptions.SaleExpenses} />
        </div>
      </fieldset>
      <Button type="submit">Next</Button>
    </form>
  )
}

export default RentalInfo
