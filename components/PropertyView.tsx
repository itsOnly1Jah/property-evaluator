import { Property } from '@/types'
import useSWR from 'swr'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


const PropertyView = ({ id }) => {
  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?_id=${id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Info
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input id="purchasePrice" type="number" placeholder={data[0].PurchaseInfo.PurchasePrice} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="afterRepairValue-">After Repair Value</Label>
          <Input id="afterRepairValue" type="number" placeholder={data[0].PurchaseInfo.AfterRepairValue} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="closingCost">Closing Cost</Label>
          <Input id="closingCost" type="number" placeholder={data[0].PurchaseInfo.ClosingCost} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="estimatedRepairCost">Closing Cost</Label>
          <Input id="estimatedRepairCost" type="number" placeholder={data[0].PurchaseInfo.EstimatedRepairCost} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Loan Details
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="role">Down Payment</Label>
          <Select defaultValue={data[0].PurchaseInfo.LoanDetails.PercentDown}>
            <SelectTrigger>
              <SelectValue placeholder={data[0].PurchaseInfo.LoanDetails.PercentDown} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0.035'>3.5%</SelectItem>
              <SelectItem value='0.05'>.5%</SelectItem>
              <SelectItem value='0.10'>10%</SelectItem>
              <SelectItem value='0.15'>15%</SelectItem>
              <SelectItem value='0.20'>20%</SelectItem>
              <SelectItem value='0.25'>25%</SelectItem>
              <SelectItem value='0.30'>30%</SelectItem>
              <SelectItem value='0.35'>35%</SelectItem>
              <SelectItem value='0.40'>40%</SelectItem>
              <SelectItem value='0.45'>45%</SelectItem>
              <SelectItem value='0.50'>50%</SelectItem>
            </SelectContent>
            <Input id="downPayment" type="number" placeholder={data[0].PurchaseInfo.LoanDetails.DownPayment} />
          </Select>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pointsFromLender">Points</Label>
          <Input id="pointsFromLender" type="number" placeholder={data[0].PurchaseInfo.LoanDetails.PointsFromLender} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherFeesFromLender">Other</Label>
          <Input id="otherFeesFromLender" type="number" placeholder={data[0].PurchaseInfo.LoanDetails.OtherFeesFromLender} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="feesInLoan">Loan Fees & Points</Label>
          <RadioGroup defaultValue="false">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="feesInLoanTrue" />
              <Label htmlFor="feesInLoanTrue">Wrap all loan fees into the loan</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="feesInLoanFalse" />
              <Label htmlFor="feesInLoanFalse">Pay all loan fees out of pocket</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="feesInLoan">Interest Only</Label>
          <RadioGroup defaultValue="false">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="interestOnlyTrue" />
              <Label htmlFor="interestOnlyTrue">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="interestOnlyFalse" />
              <Label htmlFor="interestOnlyFalse" >No</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="yearsAmortized">Years Amortized</Label>
          <Input id="yearsAmortized" type="number" placeholder={data[0].PurchaseInfo.LoanDetails.YearsAmortized} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="CapRate">Cap Rate</Label>
          <Input id="capRate" type="number" placeholder={data[0].PurchaseInfo.LoanDetails.CapRate} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Notes
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" placeholder="You are a..." />
        </div>
      </fieldset>
      <Button type="submit">Submit</Button>
    </form>
  )
}

export default PropertyView
