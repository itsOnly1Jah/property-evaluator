import { FormEvent, ChangeEvent } from 'react'
import useSWR from 'swr'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

import { numberWithCommas } from "@/lib/property-evaluator"

const PurchaseInfo = ({ id }: { id: string }) => {

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const json = JSON.stringify({
      "PurchaseInfo": {
        "PurchasePrice": Number(formData.get("purchasePrice")),
        "AfterRepairValue": Number(formData.get("afterRepairValue")),
        "ClosingCost": Number(formData.get("closingCost")),
        "EstimatedRepairCost": Number(formData.get("estimatedRepairCost")),
        "LoanDetails": {
          "PercentDown": Number(formData.get("percentDown"))/100,
          "DownPayment": Number(formData.get("downPayment")),
          "InterestRate": Number(formData.get("interestRate")),
          "PointsFromLender": Number(formData.get("pointsFromLender")),
          "OtherFeesFromLender": Number(formData.get("otherFeesFromLender")),
          "FeesInLoan": Boolean(formData.get("feesInLoan")),
          "InterestOnly": Boolean(formData.get("interestOnly")),
          "YearsAmortized": Number(formData.get("yearsAmortized")),
          "CapRate": Number(formData.get("capRate"))
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

  const updateDownPayment = (e: ChangeEvent<HTMLInputElement>) => {
    const purchaseprice = data[0].PurchaseInfo.PurchasePrice
    const percentage = +e.target.value/100
    const downpayment = document.getElementById("downPayment") as HTMLInputElement
    downpayment.value = (percentage * +purchaseprice).toFixed(2).toString()
  };

  const updatePercentage = (e: ChangeEvent<HTMLInputElement>) => {
    const purchaseprice = data[0].PurchaseInfo.PurchasePrice
    const downpayment = e.target.value

    const percentage = document.getElementsByName("percentDown")[0] as HTMLInputElement
    percentage.value = ((+downpayment/+purchaseprice)*100).toFixed(2).toString()
  };

  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?_id=${id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0" onSubmit={onSubmit}>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Info
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input name="purchasePrice" id="purchasePrice" type="number" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.PurchasePrice)}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="afterRepairValue-">After Repair Value</Label>
          <Input name="afterRepairValue" type="number" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.AfterRepairValue)}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="closingCost">Closing Cost</Label>
          <Input name="closingCost" type="number" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.ClosingCost)}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="estimatedRepairCost">Estimated Repair Cost</Label>
          <Input name="estimatedRepairCost" type="number" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.EstimatedRepairCost)}`} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Loan Details
        </legend>
        <div>
          <Label htmlFor="role">Down Payment</Label>
          <div className="flex">
            <Input name="downPayment" id="downPayment" onChange={updatePercentage} type="number" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.LoanDetails.DownPayment)}`} />
            <Input className="w-32" name="percentDown" placeholder={`${(data[0].PurchaseInfo.LoanDetails.PercentDown*100).toFixed(2)}%`} type="number" step='.01' onChange={updateDownPayment} />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="interestRate">Interest Rate</Label>
          <Input name="interestRate" type="number" step='.001' placeholder={data[0].PurchaseInfo.LoanDetails.InterestRate} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pointsFromLender">Points</Label>
          <Input name="pointsFromLender" type="number" step='.001' placeholder={data[0].PurchaseInfo.LoanDetails.PointsFromLender} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherFeesFromLender">Other</Label>
          <Input name="otherFeesFromLender" type="number" step='.01' placeholder={data[0].PurchaseInfo.LoanDetails.OtherFeesFromLender} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="feesInLoan">Loan Fees & Points</Label>
          <RadioGroup name="feesInLoan" defaultValue="false">
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
          <RadioGroup name="interestOnly" defaultValue="false">
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
          <Input name="yearsAmortized" type="number" placeholder={data[0].PurchaseInfo.LoanDetails.YearsAmortized} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="CapRate">Cap Rate</Label>
          <Input name="capRate" type="number" step='.01' placeholder={data[0].PurchaseInfo.LoanDetails.CapRate} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Notes
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="content">Content</Label>
          <Textarea name="content" placeholder="You are a..." />
        </div>
      </fieldset>
      <Button type="submit">Save</Button>
    </form>
  )
}

export default PurchaseInfo
