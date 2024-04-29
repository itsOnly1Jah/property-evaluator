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

const projectedYears: number[] = [0, 1, 4, 9, 14, 19, 29]

const ProjectionTable = ({ property }: { property: Property }) => {

  const PurchaseInfo = property.PurchaseInfo
  const RentalInfo: RentalInfo = property.RentalInfo
  const Loan = property.PurchaseInfo.LoanDetails

  const monthlyIncome = sum(Object.values(RentalInfo.Income))
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
        {loanBalanceRow(PurchaseInfo, mortgagePayment)}
        {totalProfitSoldRow(PurchaseInfo, RentalInfo, mortgagePayment, totalCashNeeded, monthlyIncome, monthlyExpenses)}
      </TableBody>
    </Table>
  )
}

const totalAnnualIncomeRow = (RentalInfo) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            sum(Object.values(RentalInfo.Income)) * 12,
            year,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ).toFixed(2)
        )}
      </TableCell>
    )
  })
  return (
    <TableRow>
      <TableHeader>Total Annual Income</TableHeader>
      {cells}
    </TableRow>
  )
}

const totalAnnualExpensesRow = (RentalInfo, annualExpenses: number) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            Math.abs(annualExpenses),
            year,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
    )
  })
  return (
    <TableRow>
      <TableHeader>Total Annual Expenses</TableHeader>
      {cells}
    </TableRow>
  )
}

const operatingExpensesRow = (RentalInfo, OperatingExpenses: number) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            OperatingExpenses,
            year,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          ).toFixed(2)
        )}
      </TableCell>
    )
  })
  return (
    <TableRow className="bg-gray-50">
      <TableHeader>&ensp;&ensp;Operating Expenses</TableHeader>
      {cells}
    </TableRow>
  )
}

const mortgagePaymentRow = (annualMortgage: number) => {
  const cells: any[] = []
  projectedYears.forEach(() => {
    cells.push(
      <TableCell>
        ${numberWithCommas(annualMortgage.toFixed(2))}
      </TableCell>
    )
  })
  return (
    <TableRow className="bg-gray-50">
      <TableHeader>&ensp;&ensp;&ensp;Mortgage Payment</TableHeader>
      {cells}
    </TableRow>
  )
}

const totalAnnualCashflow = (RentalInfo, monthlyIncome: number, monthlyExpenses: number) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        ${numberWithCommas((monthlyCashflow
          (compoundInterest(
            monthlyIncome,
            year,
            RentalInfo.FutureAssumptions.IncomeGrowth
          ), compoundInterest(
            monthlyExpenses,
            year,
            RentalInfo.FutureAssumptions.ExpenseGrowth
          )) * 12).toFixed(2)
        )}
      </TableCell>
    )
  })
  return (
    <TableRow>
      <TableHeader>Total Annual Cashflow</TableHeader>
      {cells}
    </TableRow>
  )
}

const cashOnCashRow = (RentalInfo, monthlyIncome: number, monthlyExpenses: number, totalCashInvested: number) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        {
          cashOnCashReturn(
            monthlyCashflow(
              compoundInterest(monthlyIncome, year, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, year, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12,
            totalCashInvested
          ).toFixed(2)
        }%
      </TableCell>
    )
  })
  return (
    <TableRow className="bg-gray-50">
      <TableHeader>Cash on Cash ROI</TableHeader>
      {cells}
    </TableRow>
  )
}

const propertyValueRow = (PurchaseInfo, RentalInfo) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        ${numberWithCommas(
          compoundInterest(
            PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
            year,
            RentalInfo.FutureAssumptions.PvGrowth
          ).toFixed(2)
        )}
      </TableCell>
    )
  })
  return (
    <TableRow>
      <TableHeader>Property Value</TableHeader>
      {cells}
    </TableRow>
  )
}


const equityRow = (PurchaseInfo, RentalInfo, mortgagePayment: number) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        ${numberWithCommas(
          equity(
            compoundInterest(
              PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
              year,
              RentalInfo.FutureAssumptions.PvGrowth
            ),
            loanBalance(year, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          ).toFixed(2))
        }
      </TableCell>
    )
  })
  return (
    <TableRow className="bg-gray-50">
      <TableHeader>Equity</TableHeader>
      {cells}
    </TableRow>
  )
}

const returnOnEquityRow = (PurchaseInfo, RentalInfo, mortgagePayment: number, monthlyIncome: number, monthlyExpenses: number) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        {numberWithCommas(
          returnOnEquity(
            equity(
              compoundInterest(
                PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
                year,
                RentalInfo.FutureAssumptions.PvGrowth
              ),
              loanBalance(year, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
            ),
            monthlyCashflow(
              compoundInterest(monthlyIncome, year, RentalInfo.FutureAssumptions.IncomeGrowth),
              compoundInterest(monthlyExpenses, year, RentalInfo.FutureAssumptions.ExpenseGrowth)
            ) * 12
          ).toFixed(2))
        }%
      </TableCell>
    )
  })
  return (
    <TableRow className="bg-gray-50">
      <TableHeader>Return On Equity</TableHeader>
      {cells}
    </TableRow>
  )
}

const loanBalanceRow = (PurchaseInfo,  mortgagePayment: number) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        ${numberWithCommas(
          loanBalance(year, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)
        )}
      </TableCell>
    )
  })
  return (
    <TableRow>
      <TableHeader>Loan Balance</TableHeader>
      {cells}
    </TableRow>
  )
}

const totalProfitSoldRow = (PurchaseInfo, RentalInfo, mortgagePayment: number, totalCashNeeded: number, monthlyIncome: number, monthlyExpenses: number) => {
  const cells: any[] = []
  projectedYears.forEach((year) => {
    cells.push(
      <TableCell>
        ${numberWithCommas((
          compoundInterest(PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)), year, RentalInfo.FutureAssumptions.PvGrowth) * ((100 - RentalInfo.FutureAssumptions.SaleExpenses) / 100)
          - totalCashNeeded
          - loanBalance(year, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
          - monthlyCashflow(
            compoundInterest(monthlyIncome, year, RentalInfo.FutureAssumptions.IncomeGrowth),
            compoundInterest(monthlyExpenses, year, RentalInfo.FutureAssumptions.ExpenseGrowth)
          ) * 12
        ).toFixed(2))}
      </TableCell>
    )
  })
  return (
    <TableRow className="bg-gray-50">
      <TableHeader>Total Profit if Sold</TableHeader>
      {cells}
    </TableRow>
  )
}

export default ProjectionTable
