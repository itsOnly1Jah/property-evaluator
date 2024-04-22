import {
  cashOnCashReturn,
  compoundInterest,
  equity,
  interestRatePayment,
  loanBalance,
  loanPoints,
  monthlyCashflow,
  mortgage,
  numberWithCommas,
  returnOnEquity,
  sum
} from "@/lib/property-evaluator"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Property, RentalInfo } from "@/types"

const ProjectionTable = ({ property }: { property: Property }) => {

  const PurchaseInfo = property.PurchaseInfo
  const RentalInfo: RentalInfo = property.RentalInfo
  const Loan = property.PurchaseInfo.LoanDetails

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
    <Table>
      <TableHeader>
        <TableHead />
        <TableHead className="text-center">Year 1</TableHead>
        <TableHead className="text-center">Year 2</TableHead>
        <TableHead className="text-center">Year 5</TableHead>
        <TableHead className="text-center">Year 10</TableHead>
        <TableHead className="text-center">Year 15</TableHead>
        <TableHead className="text-center">Year 20</TableHead>
        <TableHead className="text-center">Year 30</TableHead>
      </TableHeader>
      <TableBody>
        {totalAnnualIncomeRow(RentalInfo)}
        {totalAnnualExpensesRow(RentalInfo, annualExpenses)}
        {operatingExpensesRow(RentalInfo, (sum(Object.values(RentalInfo.FixedExpenses)) + variableExpenses) * 12)}
        {mortgagePaymentRow(mortgagePayment * 12)}
        {totalAnnualCashflow(RentalInfo, monthlyIncome, monthlyExpenses)}
        {cashOnCashRow(RentalInfo, monthlyIncome, monthlyExpenses, totalCashNeeded)}
        {propertyValueRow(PurchaseInfo, RentalInfo)}
        {equityRow(PurchaseInfo, RentalInfo, mortgagePayment)}
        {returnOnEquityRow(PurchaseInfo, RentalInfo, mortgagePayment, monthlyExpenses, totalCashNeeded)}
        {loanBalanceRow(PurchaseInfo, RentalInfo, mortgagePayment)}
        {totalProfitSoldRow(PurchaseInfo, RentalInfo, mortgagePayment, totalCashNeeded, monthlyIncome, monthlyExpenses)}
      </TableBody>
    </Table>
  )
}

const totalAnnualIncomeRow = (RentalInfo) => {
  return (
    <TableRow>
      <TableHeader>Total Annual Income</TableHeader>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            sum(Object.values(RentalInfo.Income)) * 12,
            0,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            sum(Object.values(RentalInfo.Income)) * 12,
            1,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            sum(Object.values(RentalInfo.Income)) * 12,
            4,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            sum(Object.values(RentalInfo.Income)) * 12,
            9,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            sum(Object.values(RentalInfo.Income)) * 12,
            14,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            sum(Object.values(RentalInfo.Income)) * 12,
            19,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            sum(Object.values(RentalInfo.Income)) * 12,
            29,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ).toFixed(2)
        )}
      </TableCell>
    </TableRow>
  )
}

const totalAnnualExpensesRow = (RentalInfo, annualExpenses: number) => {
  return (
    <TableRow>
      <TableHeader>Total Annual Expenses</TableHeader>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            Math.abs(annualExpenses),
            0,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            Math.abs(annualExpenses),
            1,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            Math.abs(annualExpenses),
            4,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            Math.abs(annualExpenses),
            9,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            Math.abs(annualExpenses),
            14,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            Math.abs(annualExpenses),
            19,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            Math.abs(annualExpenses),
            29,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
    </TableRow>
  )
}

const operatingExpensesRow = (RentalInfo, OperatingExpenses: number) => {
  return (
    <TableRow>
      <TableHeader>Operating Expenses</TableHeader>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            OperatingExpenses,
            0,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            OperatingExpenses,
            1,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            OperatingExpenses,
            4,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            OperatingExpenses,
            9,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            OperatingExpenses,
            14,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            OperatingExpenses,
            19,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            OperatingExpenses,
            29,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
    </TableRow>
  )
}

const mortgagePaymentRow = (annualMortgage: number) => {
  return (
    <TableRow>
      <TableHeader>Mortgage Payment</TableHeader>
      <TableCell>
        ${numberWithCommas(annualMortgage.toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas(annualMortgage.toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas(annualMortgage.toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas(annualMortgage.toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas(annualMortgage.toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas(annualMortgage.toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas(annualMortgage.toFixed(2))}
      </TableCell>
    </TableRow>
  )
}

const totalAnnualCashflow = (RentalInfo, monthlyIncome: number, monthlyExpenses: number) => {
  return (
    <TableRow>
      <TableHeader>Total Annual Cashflow</TableHeader>
      <TableCell>
        ${numberWithCommas((monthlyCashflow
          (compoundInterest(
            monthlyIncome,
            0,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ), compoundInterest(
            monthlyExpenses,
            0,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          )) * 12).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas((monthlyCashflow
          (compoundInterest(
            monthlyIncome,
            1,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ), compoundInterest(
            monthlyExpenses,
            1,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          )) * 12).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas((monthlyCashflow
          (compoundInterest(
            monthlyIncome,
            4,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ), compoundInterest(
            monthlyExpenses,
            4,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          )) * 12).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas((monthlyCashflow
          (compoundInterest(
            monthlyIncome,
            9,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ), compoundInterest(
            monthlyExpenses,
            9,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          )) * 12).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas((monthlyCashflow
          (compoundInterest(
            monthlyIncome,
            14,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ), compoundInterest(
            monthlyExpenses,
            14,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          )) * 12).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas((monthlyCashflow
          (compoundInterest(
            monthlyIncome,
            19,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ), compoundInterest(
            monthlyExpenses,
            19,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          )) * 12).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas((monthlyCashflow
          (compoundInterest(
            monthlyIncome,
            29,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ), compoundInterest(
            monthlyExpenses,
            29,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          )) * 12).toFixed(2)
        )}
      </TableCell>
    </TableRow>
  )
}

const cashOnCashRow = (RentalInfo, monthlyIncome: number, monthlyExpenses: number, totalCashInvested: number) => {

  return (
    <TableRow>
      <TableHeader>Cash on Cash ROI</TableHeader>
      <TableCell>
        {
          cashOnCashReturn(
            monthlyCashflow(
              compoundInterest(monthlyIncome, 0, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 0, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12,
            totalCashInvested
          ).toFixed(2)
        }%
      </TableCell>
      <TableCell>
        {
          cashOnCashReturn(
            monthlyCashflow(
              compoundInterest(monthlyIncome, 1, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 1, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12,
            totalCashInvested
          ).toFixed(2)
        }%
      </TableCell>
      <TableCell>
        {
          cashOnCashReturn(
            monthlyCashflow(
              compoundInterest(monthlyIncome, 4, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 4, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12,
            totalCashInvested
          ).toFixed(2)
        }%
      </TableCell>
      <TableCell>
        {
          cashOnCashReturn(
            monthlyCashflow(
              compoundInterest(monthlyIncome, 9, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 9, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12,
            totalCashInvested
          ).toFixed(2)
        }%
      </TableCell>
      <TableCell>
        {
          cashOnCashReturn(
            monthlyCashflow(
              compoundInterest(monthlyIncome, 14, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 14, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12,
            totalCashInvested
          ).toFixed(2)
        }%
      </TableCell>
      <TableCell>
        {
          cashOnCashReturn(
            monthlyCashflow(
              compoundInterest(monthlyIncome, 19, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 19, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12,
            totalCashInvested
          ).toFixed(2)
        }%
      </TableCell>
      <TableCell>
        {
          cashOnCashReturn(
            monthlyCashflow(
              compoundInterest(monthlyIncome, 29, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 29, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12,
            totalCashInvested
          ).toFixed(2)
        }%
      </TableCell>
    </TableRow>
  )
}

const propertyValueRow = (PurchaseInfo, RentalInfo) => {
  return (
    <TableRow>
      <TableHeader>Property Value</TableHeader>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            0,
            RentalInfo.FutureAssumptions.PvGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            1,
            RentalInfo.FutureAssumptions.PvGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            4,
            RentalInfo.FutureAssumptions.PvGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            9,
            RentalInfo.FutureAssumptions.PvGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            14,
            RentalInfo.FutureAssumptions.PvGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            19,
            RentalInfo.FutureAssumptions.PvGrowth
          ).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            29,
            RentalInfo.FutureAssumptions.PvGrowth
          ).toFixed(2)
        )}
      </TableCell>
    </TableRow>
  )
}


const equityRow = (PurchaseInfo, RentalInfo, mortgagePayment: number) => {
  return (
    <TableRow>
      <TableHeader>Equity</TableHeader>
      <TableCell>
        ${numberWithCommas(
          equity(
            compoundInterest(
              PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
              0,
              RentalInfo.FutureAssumptions.PvGrowth
            ),
            loanBalance(0, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          ).toFixed(2))
        }
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          equity(compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            1,
            RentalInfo.FutureAssumptions.PvGrowth
          ),
            loanBalance(1, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          ).toFixed(2))
        }
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          equity(
            compoundInterest(
              PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
              4,
              RentalInfo.FutureAssumptions.PvGrowth
            ),
            loanBalance(4, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          ).toFixed(2))
        }
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          equity(
            compoundInterest(
              PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
              9,
              RentalInfo.FutureAssumptions.PvGrowth
            ),
            loanBalance(9, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          ).toFixed(2))
        }
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          equity(
            compoundInterest(
              PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
              14,
              RentalInfo.FutureAssumptions.PvGrowth
            ),
            loanBalance(14, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          ).toFixed(2))
        }
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          equity(
            compoundInterest(
              PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
              19,
              RentalInfo.FutureAssumptions.PvGrowth
            ),
            loanBalance(19, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          ).toFixed(2))
        }
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          equity(
            compoundInterest(
              PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
              29,
              RentalInfo.FutureAssumptions.PvGrowth
            ),
            loanBalance(29, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          ).toFixed(2))
        }
      </TableCell>
    </TableRow>
  )
}

const returnOnEquityRow = (PurchaseInfo, RentalInfo, mortgagePayment: number, monthlyIncome: number, monthlyExpenses: number) => {
  return (
    <TableRow>
      <TableHeader>Return On Equity</TableHeader>
      <TableCell>
        {numberWithCommas(
          returnOnEquity(
            equity(
              compoundInterest(
                PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
                0,
                RentalInfo.FutureAssumptions.PvGrowth
              ),
              loanBalance(0, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
            ),
            monthlyCashflow(
              compoundInterest(monthlyIncome, 0, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 0, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12
          ).toFixed(2))
        }%
      </TableCell>
      <TableCell>
        {numberWithCommas(
          returnOnEquity(
            equity(
              compoundInterest(
                PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
                1,
                RentalInfo.FutureAssumptions.PvGrowth
              ),
              loanBalance(1, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
            ),
            monthlyCashflow(
              compoundInterest(monthlyIncome, 1, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 1, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12
          ).toFixed(2))
        }%
      </TableCell>
      <TableCell>
        {numberWithCommas(
          returnOnEquity(
            equity(
              compoundInterest(
                PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
                4,
                RentalInfo.FutureAssumptions.PvGrowth
              ),
              loanBalance(4, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
            ),
            monthlyCashflow(
              compoundInterest(monthlyIncome, 4, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 4, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12
          ).toFixed(2))
        }%
      </TableCell>
      <TableCell>
        {numberWithCommas(
          returnOnEquity(
            equity(
              compoundInterest(
                PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
                9,
                RentalInfo.FutureAssumptions.PvGrowth
              ),
              loanBalance(9, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
            ),
            monthlyCashflow(
              compoundInterest(monthlyIncome, 9, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 9, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12
          ).toFixed(2))
        }%
      </TableCell>
      <TableCell>
        {numberWithCommas(
          returnOnEquity(
            equity(
              compoundInterest(
                PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
                14,
                RentalInfo.FutureAssumptions.PvGrowth
              ),
              loanBalance(14, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
            ),
            monthlyCashflow(
              compoundInterest(monthlyIncome, 14, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 14, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12
          ).toFixed(2))
        }%
      </TableCell>
      <TableCell>
        {numberWithCommas(
          returnOnEquity(
            equity(
              compoundInterest(
                PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
                19,
                RentalInfo.FutureAssumptions.PvGrowth
              ),
              loanBalance(19, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
            ),
            monthlyCashflow(
              compoundInterest(monthlyIncome, 19, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 19, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12
          ).toFixed(2))
        }%
      </TableCell>
      <TableCell>
        {numberWithCommas(
          returnOnEquity(
            equity(
              compoundInterest(
                PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
                29,
                RentalInfo.FutureAssumptions.PvGrowth
              ),
              loanBalance(29, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
            ),
            monthlyCashflow(
              compoundInterest(monthlyIncome, 29, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, 29, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12
          ).toFixed(2))
        }%
      </TableCell>
    </TableRow>
  )
}

const loanBalanceRow = (PurchaseInfo, RentalInfo, mortgagePayment: number) => {
  return (
    <TableRow>
      <TableHeader>Loan Balance</TableHeader>
      <TableCell>
        ${numberWithCommas(
          loanBalance(0, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          loanBalance(1, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          loanBalance(4, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          loanBalance(9, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          loanBalance(14, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          loanBalance(19, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)
        )}
      </TableCell>
      <TableCell>
        ${numberWithCommas(
          loanBalance(29, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)
        )}
      </TableCell>
    </TableRow>
  )
}

const totalProfitSoldRow = (PurchaseInfo, RentalInfo, mortgagePayment: number, totalCashNeeded: number, monthlyIncome: number, monthlyExpenses: number) => {
  return (
    <TableRow>
      <TableHeader>Total Profit if Sold</TableHeader>
      <TableCell>
        ${numberWithCommas((
          compoundInterest(PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)), 0, RentalInfo.FutureAssumptions.PvGrowth) * ((100 - RentalInfo.FutureAssumptions.SaleExpenses) / 100)
          - totalCashNeeded
          - loanBalance(0, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          - monthlyCashflow(
            compoundInterest(monthlyIncome, 0, RentalInfo.FutureAssumptions.IncomeGrowth),
            compoundInterest(monthlyExpenses, 0, RentalInfo.FutureAssumptions.ExpenseGrowth)
          ) * 12
        ).toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas((
          compoundInterest(PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)), 1, RentalInfo.FutureAssumptions.PvGrowth) * ((100 - RentalInfo.FutureAssumptions.SaleExpenses) / 100)
          - totalCashNeeded
          - loanBalance(1, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          - monthlyCashflow(
            compoundInterest(monthlyIncome, 1, RentalInfo.FutureAssumptions.IncomeGrowth),
            compoundInterest(monthlyExpenses, 1, RentalInfo.FutureAssumptions.ExpenseGrowth)
          ) * 12
        ).toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas((
          compoundInterest(PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)), 4, RentalInfo.FutureAssumptions.PvGrowth) * ((100 - RentalInfo.FutureAssumptions.SaleExpenses) / 100)
          - totalCashNeeded
          - loanBalance(4, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          - monthlyCashflow(
            compoundInterest(monthlyIncome, 4, RentalInfo.FutureAssumptions.IncomeGrowth),
            compoundInterest(monthlyExpenses, 4, RentalInfo.FutureAssumptions.ExpenseGrowth)
          ) * 12
        ).toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas((
          compoundInterest(PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)), 9, RentalInfo.FutureAssumptions.PvGrowth) * ((100 - RentalInfo.FutureAssumptions.SaleExpenses) / 100)
          - totalCashNeeded
          - loanBalance(9, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          - monthlyCashflow(
            compoundInterest(monthlyIncome, 9, RentalInfo.FutureAssumptions.IncomeGrowth),
            compoundInterest(monthlyExpenses, 9, RentalInfo.FutureAssumptions.ExpenseGrowth)
          ) * 12
        ).toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas((
          compoundInterest(PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)), 14, RentalInfo.FutureAssumptions.PvGrowth) * ((100 - RentalInfo.FutureAssumptions.SaleExpenses) / 100)
          - totalCashNeeded
          - loanBalance(14, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          - monthlyCashflow(
            compoundInterest(monthlyIncome, 14, RentalInfo.FutureAssumptions.IncomeGrowth),
            compoundInterest(monthlyExpenses, 14, RentalInfo.FutureAssumptions.ExpenseGrowth)
          ) * 12
        ).toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas((
          compoundInterest(PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)), 19, RentalInfo.FutureAssumptions.PvGrowth) * ((100 - RentalInfo.FutureAssumptions.SaleExpenses) / 100)
          - totalCashNeeded
          - loanBalance(19, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          - monthlyCashflow(
            compoundInterest(monthlyIncome, 19, RentalInfo.FutureAssumptions.IncomeGrowth),
            compoundInterest(monthlyExpenses, 19, RentalInfo.FutureAssumptions.ExpenseGrowth)
          ) * 12
        ).toFixed(2))}
      </TableCell>
      <TableCell>
        ${numberWithCommas((
          compoundInterest(PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)), 29, RentalInfo.FutureAssumptions.PvGrowth) * ((100 - RentalInfo.FutureAssumptions.SaleExpenses) / 100)
          - totalCashNeeded
          - loanBalance(29, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          - monthlyCashflow(
            compoundInterest(monthlyIncome, 29, RentalInfo.FutureAssumptions.IncomeGrowth),
            compoundInterest(monthlyExpenses, 29, RentalInfo.FutureAssumptions.ExpenseGrowth)
          ) * 12
        ).toFixed(2))}
      </TableCell>
    </TableRow>
  )
}

export default ProjectionTable
