export const sum = (nums: number[]): number => {
  return nums.reduce((total, n) => total + n, 0)
}

export const numberWithCommas = (n: string): string => {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const returnOnInvestment = (income: number, investment: number): number => {
  return income / investment
}

export const monthlyCashflow = (income: number, expenses: number): number => {
  return sum([income, expenses])
}

export const netOperatingIncome = (totalAnnualIncome: number, totalAnnualExpenses: number): number => {
  return sum([totalAnnualIncome, totalAnnualExpenses])
}

export const purchaseCapRate = (netOperatingIncome: number, propertyValue: number) => {
  return (netOperatingIncome / propertyValue) * 100
}

export const proFormaCap = (netOperatingIncome: number, propertyAfterRepairValue: number): number => {
  return purchaseCapRate(netOperatingIncome, propertyAfterRepairValue)
}

export const twoPercentRule = (rentalIncome: number, totalProjectCost: number): number => {
  return (rentalIncome / totalProjectCost) * 100
}


export const equity = (propertyValue: number, loan: number): number => {
  return sum([propertyValue, loan]) * 100
}

export const grossRentMultiplier = (purchasePrice: number, income: number): number => {
  return purchasePrice / income
}

export const debtServiceRatio = (netOperatingIncome: number, payment: number): number => {
  return netOperatingIncome / payment
}

export const mortgage = (principal: number, rate: number, time: number): number => {
  return principal * rate * (Math.pow(1 + rate, time) / Math.abs((Math.pow(1 + rate, time) - 1)))
}

export const loanPoints = (purchasePrice: number, downPayment: number, points: number): number => {
  return (purchasePrice - downPayment) * (points / 100)
}

export const loanBalance = (year: number, mortgage: number, interestRate: number, yearsAmortized: number): number => {
  const x = mortgage
  const i = interestRate / 1200
  const n = (yearsAmortized - (year + 1)) * 12
  return (x * (1 - Math.pow((1 + i), -n))) / i || 0
}

export const interestRatePayment = (year: number, mortgage: number, interestRate: number, yearsAmortized: number): number => {
  const balance = loanBalance(year, mortgage, interestRate, yearsAmortized)
  return ((interestRate / 100) / 12) * balance
}
