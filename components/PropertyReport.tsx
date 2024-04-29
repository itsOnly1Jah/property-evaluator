import useSWR from 'swr'
import {
  debtServiceRatio,
  grossRentMultiplier,
  interestRatePayment,
  loanPoints,
  monthlyCashflow,
  mortgage,
  netOperatingIncome,
  numberWithCommas,
  proFormaCap,
  purchaseCapRate,
  returnOnInvestment,
  sum,
  twoPercentRule,
} from "@/lib/property-evaluator"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ProjectionTable from "@/components/PropertyProjectionsTable"

import { ExpenseChart, IncomeExpensesCashflowChart, LoanBalanceValueEquityChart } from "@/components/PropertyExpenseChart"

const PropertyReport = ({ id }: { id: string }) => {

  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?_id=${id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const PurchaseInfo = data[0].PurchaseInfo
  const RentalInfo = data[0].RentalInfo
  const Loan = data[0].PurchaseInfo.LoanDetails

  const monthlyIncome = sum(Object.values(RentalInfo.Income))
  const annualIncome = sum(Object.values(RentalInfo.Income)) * 12
  const points = loanPoints(
    PurchaseInfo.PurchasePrice,
    Loan.DownPayment,
    Loan.PointsFromLender
  )

  const p = Loan.FeesInLoan
    ? PurchaseInfo.PurchasePrice -
    sum([
      Loan.DownPayment,
      Loan.OtherFeesFromLender,
      points
    ])
    : PurchaseInfo.PurchasePrice - Loan.DownPayment
  const r = (Loan.InterestRate / 100) / 12
  const t = Loan.YearsAmortized * 12
  const mortgagePayment = mortgage(p, r, t)

  const intrestOnlyPayment = interestRatePayment(
    0,
    mortgagePayment,
    Loan.InterestRate,
    Loan.YearsAmortized
  )

  const vExpenses: number[] = Object.values(RentalInfo.VariableExpenses)
  const variableExpenses: number = sum(vExpenses.map((expense: number) => monthlyIncome * expense / 100))
  const fixedExpensesNoTax = Object.fromEntries(Object.entries(RentalInfo.FixedExpenses).filter(e => e[0] != "PropertyTaxes"))
  const monthlyExpenses = -(sum(Object.values(fixedExpensesNoTax)) + RentalInfo.FixedExpenses.PropertyTaxes / 12 + variableExpenses + (Loan.InterestOnly ? intrestOnlyPayment : mortgagePayment))
  const annualExpenses = monthlyExpenses * 12
  const totalProjectCost = sum([
    PurchaseInfo.PurchasePrice,
    PurchaseInfo.ClosingCost,
    PurchaseInfo.EstimatedRepairCost
  ])
  const totalCashNeeded = sum([
    Loan.DownPayment,
    PurchaseInfo.ClosingCost,
    PurchaseInfo.EstimatedRepairCost,
    (Loan.InterestOnly ? intrestOnlyPayment : mortgagePayment)
  ])

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-2 lg:col-span-2">
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-5">
        <Card x-chunk="dashboard-05-chunk-1" className="text-center content-center">
          <CardHeader className="pb-2">
            <CardDescription>ROI</CardDescription>
            <CardTitle className="text-4xl">
              {
                returnOnInvestment(
                  annualIncome,
                  sum([Loan.DownPayment, PurchaseInfo.ClosingCost, PurchaseInfo.EstimatedRepairCost])
                ).toFixed(2)
              }%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +25% from last week
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-05-chunk-1" className="text-center content-center">
          <CardHeader className="pb-2">
            <CardDescription>Monthly Cashflow</CardDescription>
            <CardTitle className="text-4xl">
              ${numberWithCommas(monthlyCashflow(monthlyIncome, monthlyExpenses).toFixed(2))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +25% from last week
            </div>
          </CardContent>
        </Card>
        <div>
          <Card x-chunk="dashboard-05-chunk-1" className="text-center content-center">
            <CardHeader className="pb-2">
              <CardDescription>Monthly Income</CardDescription>
              <CardTitle className="text-4xl">${numberWithCommas(monthlyIncome.toFixed(2))}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1" className="text-center content-center">
            <CardHeader className="pb-2">
              <CardDescription>Monthly Expenses</CardDescription>
              <CardTitle className="text-4xl">${numberWithCommas(Math.abs(monthlyExpenses).toFixed(2))}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
          </Card>
        </div>
        <Card x-chunk="dashboard-05-chunk-2" className="text-center content-center">
          <CardHeader className="pb-2">
            <CardDescription>NOI</CardDescription>
            <CardTitle className="text-4xl">${numberWithCommas(netOperatingIncome(annualIncome, annualExpenses).toFixed(2))}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +10% from last month
            </div>
          </CardContent>
        </Card>
        <div>
          <Card x-chunk="dashboard-05-chunk-1" className="text-center content-center">
            <CardHeader className="pb-2">
              <CardDescription>Purchase Cap Rate</CardDescription>
              <CardTitle className="text-4xl">
                ${
                  numberWithCommas(purchaseCapRate(
                    netOperatingIncome(annualIncome, annualExpenses),
                    PurchaseInfo.PurchasePrice
                  ).toFixed(2))
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1" className="text-center content-center">
            <CardHeader className="pb-2">
              <CardDescription>Pro Forma Cap</CardDescription>
              <CardTitle className="text-4xl">
                ${
                  numberWithCommas(proFormaCap(
                    netOperatingIncome(annualIncome, annualExpenses),
                    PurchaseInfo.AfterRepairValue
                  ).toFixed(2))
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card x-chunk="dashboard-05-chunk-1" className="flex-auto pt-5 pb-5">
        <div className="grid place-items-center h-[28rem]">
          <ExpenseChart id={id} />
        </div>
      </Card>
      <div>
        <div className="flex gap-2">
          <Card x-chunk="dashboard-05-chunk-1" className="text-center">
            <CardHeader className="pb-2">
              <CardDescription>PurchaseInfo</CardDescription>
              <CardTitle className="text-4xl">${numberWithCommas(PurchaseInfo.PurchasePrice.toFixed(2))}</CardTitle>
            </CardHeader>
            <CardFooter className="text-xs text-muted-foreground">Purchase Price</CardFooter>
          </Card>
          <Card className="content-center">
            <div className="mx-28 grid gap-56 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              <div>
                <p><strong>Closing Cost</strong><span className="margin mx-6"></span>${numberWithCommas(PurchaseInfo.ClosingCost.toFixed(2))}</p>
                <p><strong>Estimated Repairs</strong><span className="margin mx-2"></span>${numberWithCommas(PurchaseInfo.EstimatedRepairCost.toFixed(2))}</p>
                <p><strong>Total Project Cost</strong><span className="margin mx-1"></span>
                  ${
                    numberWithCommas(totalProjectCost.toFixed(2))
                  }
                </p>
                <p><strong>After Repair Value</strong><span className="margin mx-1"></span>${numberWithCommas(PurchaseInfo.AfterRepairValue.toFixed(2))}</p>
              </div>
              <div>
                <p><strong>Down Payment</strong><span className="margin mx-5"></span>${numberWithCommas(Loan.DownPayment.toFixed(2))}</p>
                <p><strong>Loan Amount</strong><span className="margin mx-7"></span>${numberWithCommas((PurchaseInfo.PurchasePrice - Loan.DownPayment).toFixed(2))}</p>
                <p><strong>Loan Points</strong><span className="margin mx-9"></span>{Loan.PointsFromLender}</p>
                <p><strong>Amortized</strong><span className="margin mx-10"></span>{Loan.YearsAmortized}</p>
              </div>
              <div>
                <p><strong>Loan Intrest</strong><span className="margin mx-8"></span>{Loan.InterestRate}%</p>
                <p><strong>Monthly P&I</strong><span className="margin mx-8"></span>${numberWithCommas(Math.abs(mortgagePayment).toFixed(2))}</p>
                <p><strong>Total Cash Needed</strong><span className="margin mx-2"></span>
                  ${
                    numberWithCommas(totalCashNeeded.toFixed(2))
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>
      <div className="flex-wrap">
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
            <CardDescription className="text-center">FinancialInfo</CardDescription>
            <CardTitle className="text-4xl text-center">Financial Info</CardTitle>
          </CardHeader>
          <CardContent className="pt-10">
            <div className="grid gap-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
              <div>
                <h5 className="text-center">{twoPercentRule(monthlyIncome, totalProjectCost).toFixed(2)}%</h5>
                <p className="text-center">2% Rule</p>
              </div>
              <div>
                <h5 className="text-center">
                  ${
                    numberWithCommas((
                      PurchaseInfo.AfterRepairValue - (PurchaseInfo.PurchasePrice - Loan.DownPayment)
                    ).toFixed(2))
                  }
                </h5>
                <p className="text-center">Total Initial Equity</p>
              </div>
              <div>
                <h5 className="text-center">
                  {grossRentMultiplier(PurchaseInfo.PurchasePrice, annualIncome).toFixed(2)}%
                </h5>
                <p className="text-center">Gross Rent Multiplier</p>
              </div>
              <div>
                <h5 className="text-center">
                  {
                    debtServiceRatio(
                      netOperatingIncome(annualIncome, annualExpenses),
                      (Loan.FeesInLoan ? intrestOnlyPayment * 12 : mortgagePayment * 12)
                    ).toFixed(2)
                  }%
                </h5>
                <p className="text-center">Debt Coverage Ratio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex-wrap">
        <Card x-chunk="dashboard-05-chunk-1" className="text-center">
          <CardHeader className="pb-2 ">
            <CardDescription>Analysis</CardDescription>
            <CardTitle className="text-4xl">Projections</CardTitle>
          </CardHeader>
          <CardContent className="pt-10">
            <div className="grid gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              <div>
                <h5 className="text-center">{RentalInfo.FutureAssumptions.ExpenseGrowth}% /year</h5>
                <p className="text-center">Expense Increase</p>
              </div>
              <div>
                <h5 className="text-center">{RentalInfo.FutureAssumptions.IncomeGrowth} % /year</h5>
                <p className="text-center">Income Increase</p>
              </div>
              <div>
                <h5 className="text-center">{RentalInfo.FutureAssumptions.PvGrowth} % /year</h5>
                <p className="text-center">Property Value Increase</p>
              </div>
            </div>
            <div className="pt-14 content-center">
              <ProjectionTable property={data[0]} />
            </div>
            <div className="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 pt-10">
              <div>
                <h5 className="text-center">Income, Expenses and Cashflow</h5>
                <IncomeExpensesCashflowChart property={data[0]} />
              </div>
              <div>
                <h5 className="text-center">Loan Balance, Value and Equity</h5>
                <LoanBalanceValueEquityChart property={data[0]} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>


  )
}

export default PropertyReport
