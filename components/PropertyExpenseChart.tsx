import useSWR from 'swr'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2'
import {
  interestRatePayment,
  loanPoints,
  mortgage,
  pmi,
  sum,
} from "@/lib/property-evaluator"

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = (id) => {

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
    PMI: Number((pmi(RentalInfo.FixedExpenses.Pmi, (PurchaseInfo.PurchasePrice - Loan.DownPayment))/12).toFixed(2)),
    Garbage: RentalInfo.FixedExpenses.Garbage,
    HOA: RentalInfo.FixedExpenses.Hoa,
    Insurance: RentalInfo.FixedExpenses.MonthlyInsurance,
    'Property Taxes': Number((RentalInfo.FixedExpenses.PropertyTaxes/12).toFixed(2)),
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

export default ExpenseChart
