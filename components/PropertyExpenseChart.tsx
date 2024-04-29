import useSWR from 'swr'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Pie, Line } from 'react-chartjs-2'
import {
  compoundInterest,
  equity,
  interestRatePayment,
  loanBalance,
  loanPoints,
  monthlyCashflow,
  mortgage,
  pmi,
  sum,
} from "@/lib/property-evaluator"

ChartJS.register(
  ArcElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

import { Property } from "@/types"

export const ExpenseChart = (id) => {

  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?_id=${id.id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>
  const Loan = data[0].PurchaseInfo.LoanDetails
  const PurchaseInfo = data[0].PurchaseInfo
  const RentalInfo = data[0].RentalInfo

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

  type ChartExpenses = {
    Electricity: number;
    "Water & Sewer": number;
    PMI: number;
    Garbage: number;
    HOA: number;
    Insurance: number;
    "Property Taxes": number;
    Other: number;
    Vacancy: number;
    "Repairs & Maintenance": number;
    CapitalEx: number;
    Management: number;
    "P&I": number
  }

  const ChartInfo: ChartExpenses = {
    Electricity: RentalInfo.FixedExpenses.Electricity,
    'Water & Sewer': RentalInfo.FixedExpenses.WaterSewer,
    PMI: Number((pmi(RentalInfo.FixedExpenses.Pmi, (PurchaseInfo.PurchasePrice - Loan.DownPayment)) / 12).toFixed(2)),
    Garbage: RentalInfo.FixedExpenses.Garbage,
    HOA: RentalInfo.FixedExpenses.Hoa,
    Insurance: RentalInfo.FixedExpenses.MonthlyInsurance,
    'Property Taxes': Number((RentalInfo.FixedExpenses.PropertyTaxes / 12).toFixed(2)),
    Other: RentalInfo.FixedExpenses.OtherMonthlyExpenses,
    Vacancy: monthlyIncome * (RentalInfo.VariableExpenses.Vacancy / 100),
    "Repairs & Maintenance": monthlyIncome * (RentalInfo.VariableExpenses.RepairsMaintenance / 100),
    CapitalEx: monthlyIncome * (RentalInfo.VariableExpenses.CapitalExpenditures / 100),
    Management: monthlyIncome * (RentalInfo.VariableExpenses.ManagementFees / 100),
    "P&I": Loan.InterestOnly ? intrestOnlyPayment : mortgagePayment
  }

  const FilterdEntries = Object.entries(ChartInfo).filter(([_, value]) => value != 0)
  const FilteredChartInfo = Object.fromEntries(FilterdEntries)

  return (
    <Pie
      data={{
        labels: Object.keys(FilteredChartInfo),
        datasets: [{
          label: 'Expenses',
          data: Object.values(FilteredChartInfo),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 123, 65, 0.6)',
            'rgba(29, 18, 227, 0.6)',
            'rgba(227, 133, 18, 0.6)',
            'rgba(227, 29, 18, 0.6)',
            'rgba(164, 227, 18, 0.6)',
            'rgba(227, 18, 59, 0.6)',
            'rgba(156, 152, 157, 0.6)'
          ]
        }]
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            reverse: true
          }
        }
      }}
    />
  )
}

export const IncomeExpensesCashflowChart = ({ property }: { property: Property }) => {

  const PurchaseInfo = property.PurchaseInfo
  const RentalInfo = property.RentalInfo
  const Loan = property.PurchaseInfo.LoanDetails

  const points: number = loanPoints(
    PurchaseInfo.PurchasePrice,
    Loan.DownPayment,
    Loan.PointsFromLender
  )
  const p: number = Loan.FeesInLoan
    ? PurchaseInfo.PurchasePrice -
    sum([
      Loan.DownPayment,
      Loan.OtherFeesFromLender,
      points
    ])
    : PurchaseInfo.PurchasePrice - Loan.DownPayment
  const r: number = (Loan.InterestRate / 100) / 12
  const t: number = Loan.YearsAmortized * 12
  const mortgagePayment: number = mortgage(p, r, t)

  const intrestOnlyPayment: number = interestRatePayment(
    0,
    mortgagePayment,
    Loan.InterestRate,
    Loan.YearsAmortized
  )

  const monthlyIncome = sum(Object.values(RentalInfo.Income))
  const vExpenses: number[] = Object.values(RentalInfo.VariableExpenses)
  const variableExpenses: number = sum(vExpenses.map((expense: number) => monthlyIncome * expense / 100))
  const fixedExpensesNoTax = Object.fromEntries(Object.entries(RentalInfo.FixedExpenses).filter(e => e[0] != "PropertyTaxes"))
  const monthlyExpenses: number = -(sum(Object.values(fixedExpensesNoTax)) + RentalInfo.FixedExpenses.PropertyTaxes / 12 + variableExpenses + (Loan.InterestOnly ? intrestOnlyPayment : mortgagePayment))
  const annualExpenses: number = monthlyExpenses * 12

  const years: number[] = Array.from(Array(30).keys())
  const incomeData: number[] = years.map(n => Number(compoundInterest(sum(Object.values(RentalInfo.Income)) * 12, n, RentalInfo.FutureAssumptions.IncomeGrowth).toFixed(2)))
  const expenseData: number[] = years.map(n => Number(compoundInterest(Math.abs(annualExpenses), n, RentalInfo.FutureAssumptions.ExpenseGrowth).toFixed(2)))
  const cashflowData: number[] = years.map(n => Number((monthlyCashflow(
    compoundInterest(monthlyIncome, n, RentalInfo.FutureAssumptions.IncomeGrowth),
    compoundInterest(monthlyExpenses, n, RentalInfo.FutureAssumptions.ExpenseGrowth)
  ) * 12).toFixed(2)))

  return (
    <Line
      data={{
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', ' Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10',
          'Year 11', 'Year 12', 'Year 13', 'Year 14', 'Year 15', 'Year 16', 'Year 17', 'Year 18', 'Year 19', 'Year 20',
          'Year 21', 'Year 22', 'Year 23', 'Year 24', 'Year 25', 'Year 26', 'Year 27', 'Year 28', 'Year 29', 'Year 30'],
        datasets: [
          {
            label: 'Income',
            data: incomeData,
            backgroundColor: 'rgba(0, 204, 51, 0.6)',
            borderColor: [
              'rgba(0, 204, 51, 0.6)',
            ],
            fill: false,
            pointRadius: 0,
            pointHitRadius: 10,
          },
          {
            label: 'Expenses',
            data: expenseData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: [
              'rgba(255, 99, 132, 0.6)',
            ],
            fill: false,
            pointRadius: 0,
            pointHitRadius: 10,
          },
          {
            label: 'Cashflow',
            data: cashflowData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: [
              'rgba(54, 162, 235, 0.6)',
            ],
            fill: false,
            pointRadius: 0,
            pointHitRadius: 10,
          },
        ]
      }}
      options={{
        responsive: true,
        scales: {
          x: {
            ticks: {
              display: false
            }
          },
          y: {
            display: false,
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            reverse: true
          }
        }
      }}
    />
  )
}

export const LoanBalanceValueEquityChart = ({ property }: { property: Property }) => {

  const PurchaseInfo = property.PurchaseInfo
  const RentalInfo = property.RentalInfo
  const Loan = property.PurchaseInfo.LoanDetails

  const points: number = loanPoints(
    PurchaseInfo.PurchasePrice,
    Loan.DownPayment,
    Loan.PointsFromLender
  )
  const p: number = Loan.FeesInLoan
    ? PurchaseInfo.PurchasePrice -
    sum([
      Loan.DownPayment,
      Loan.OtherFeesFromLender,
      points
    ])
    : PurchaseInfo.PurchasePrice - Loan.DownPayment
  const r: number = (Loan.InterestRate / 100) / 12
  const t: number = Loan.YearsAmortized * 12
  const mortgagePayment = mortgage(p, r, t)

  const years: number[] = Array.from(Array(30).keys())
  const loanBalanceData: number[] = years.map(n => Number(loanBalance(n, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized).toFixed(2)))
  const equityData: number[] = years.map(n => Number(equity(
    compoundInterest(
      PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
      n,
      RentalInfo.FutureAssumptions.PvGrowth
    ),
    loanBalance(n, mortgagePayment, PurchaseInfo.LoanDetails.InterestRate, PurchaseInfo.LoanDetails.YearsAmortized)
  ).toFixed(2)))
  const propertyValueData: number[] = years.map(n => Number(compoundInterest(
    PurchaseInfo.AfterRepairValue * (1 + (RentalInfo.FutureAssumptions.PvGrowth / 100)),
    n,
    RentalInfo.FutureAssumptions.PvGrowth
  ).toFixed(2)))

  return (
    <Line
      data={{
        labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', ' Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10',
          'Year 11', 'Year 12', 'Year 13', 'Year 14', 'Year 15', 'Year 16', 'Year 17', 'Year 18', 'Year 19', 'Year 20',
          'Year 21', 'Year 22', 'Year 23', 'Year 24', 'Year 25', 'Year 26', 'Year 27', 'Year 28', 'Year 29', 'Year 30'],
        datasets: [
          {
            label: 'Loan Balance ',
            data: loanBalanceData,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            fill: true,
            pointRadius: 0,
            pointHitRadius: 10,
          },
          {
            label: 'Equity',
            data: equityData,
            backgroundColor: 'rgba(0, 204, 51, 0.6)',
            fill: true,
            pointRadius: 0,
            pointHitRadius: 10,
          },
          {
            label: 'Property Value',
            data: propertyValueData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            fill: true,
            pointRadius: 0,
            pointHitRadius: 10,
          },
        ]
      }}
      options={{
        responsive: true,
        scales: {
          x: {
            ticks: {
              display: false
            }
          },
          y: {
            display: false,
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            reverse: true
          },
        }
      }}
    />
  )
}
