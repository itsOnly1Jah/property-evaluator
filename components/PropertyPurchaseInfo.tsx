import { FormEvent, useState } from 'react'
import useSWR from 'swr'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import { numberWithCommas } from "@/lib/property-evaluator"
import { updatePercentage, updateDownPayment } from "@/lib/formFunctions"

const PurchaseInfo = ({ id }: { id: string }) => {

  const [isSubmitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const json = JSON.stringify({
      "PurchaseInfo": {
        "PurchasePrice": Number(formData.get("purchasePrice")),
        "AfterRepairValue": Number(formData.get("afterRepairValue")),
        "ClosingCost": Number(formData.get("closingCost")),
        "EstimatedRepairCost": Number(formData.get("estimatedRepairCost")),
        "LoanDetails": {
          "PercentDown": Number(formData.get("percentDown")) / 100,
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
    }).then(res => {
      toast({
        title: "Success!",
        description: "The property has been updated successfully.",
      })
      console.log(res)
    }).catch(err => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
      console.log(err)
    })
    setSubmitting(false)
  }

  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?_id=${id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <form className="grid w-full items-start gap-6 overflow-auto p-4 pt-0" onSubmit={onSubmit}>
      <Toaster />
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Info
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input name="purchasePrice" id="purchasePrice" type="number" min="0" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.PurchasePrice)}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="afterRepairValue">After Repair Value</Label>
          <Input id="afterRepairValue" name="afterRepairValue" type="number" min="0" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.AfterRepairValue)}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="closingCost">Closing Cost</Label>
          <Input id="closingCost" name="closingCost" type="number" min="0" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.ClosingCost)}`} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="estimatedRepairCost">Estimated Repair Cost</Label>
          <Input id="estimatedRepairCost" name="estimatedRepairCost" type="number" min="0" step='.01' placeholder={`$${numberWithCommas(data[0].PurchaseInfo.EstimatedRepairCost)}`} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Loan Details
        </legend>
        <div>
          <Label htmlFor="downPayment">Down Payment</Label>
          <div className="flex">
            <Input
              name="downPayment"
              id="downPayment"
              onChange={event => updatePercentage(
                event,
                document.getElementsByName("percentDown")[0] as HTMLInputElement,
                (document.getElementById("purchasePrice") as HTMLInputElement)?.value ?
                  (document.getElementById("purchasePrice") as HTMLInputElement)?.value :
                  data[0].PurchaseInfo.PurchasePrice
              )}
              type="number"
              min="0"
              max={
                (document.getElementById("purchasePrice") as HTMLInputElement)?.value ?
                  (document.getElementById("purchasePrice") as HTMLInputElement)?.value :
                  data[0].PurchaseInfo.PurchasePrice
              }
              step='.01'
              placeholder={`$${numberWithCommas(data[0].PurchaseInfo.LoanDetails.DownPayment)}`}
            />
            <Input
              className="w-32"
              name="percentDown"
              placeholder={`${(data[0].PurchaseInfo.LoanDetails.PercentDown * 100).toFixed(2)}%`}
              type="number"
              min="0"
              max="100"
              step='.01'
              onChange={
                event => updateDownPayment(
                  event,
                  document.getElementById("downPayment") as HTMLInputElement,
                  (document.getElementById("purchasePrice") as HTMLInputElement).value ?
                    (document.getElementById("purchasePrice") as HTMLInputElement).value :
                    data[0].PurchaseInfo.PurchasePrice
                )}
            />
          </div>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="interestRate">Interest Rate</Label>
          <Input id="interestRate" name="interestRate" type="number" min="0" step='.001' placeholder={data[0].PurchaseInfo.LoanDetails.InterestRate} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="pointsFromLender">Points</Label>
          <Input id="pointsFromLender" name="pointsFromLender" type="number" min="0" step='.001' placeholder={data[0].PurchaseInfo.LoanDetails.PointsFromLender} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="otherFeesFromLender">Other</Label>
          <Input id="otherFeesFromLender" name="otherFeesFromLender" type="number" min="0"  step='.01' placeholder={data[0].PurchaseInfo.LoanDetails.OtherFeesFromLender} />
        </div>
        <div className="grid gap-3">
          <Label>Loan Fees & Points</Label>
          <RadioGroup id="feesInLoan" name="feesInLoan" defaultValue="false">
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
          <Label>Interest Only</Label>
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
          <Input id="yearsAmortized" name="yearsAmortized" type="number" min="0" placeholder={data[0].PurchaseInfo.LoanDetails.YearsAmortized} />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="capRate">Cap Rate</Label>
          <Input id="capRate" name="capRate" type="number" min="0"  step='.01' placeholder={data[0].PurchaseInfo.LoanDetails.CapRate} />
        </div>
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Notes
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" name="content" placeholder="You are a..." />
        </div>
      </fieldset>
      <Button type="submit" disabled={isSubmitting}>Save</Button>
    </form>
  )
}

export default PurchaseInfo
