
export interface Property {
    Id: string;
    Address: Address;
    PurchaseInfo: PurchaseInfo;
    RentalInfo: RentalInfo;
    Zestimate: number;
    LastSoldDate: Date;
    LastSoldPrice: number;
    CreatedBy: any;
    UpdatedBy: any;
}

type Address = {
  Street: string
  Zipcode: string
  City: string
  State: string
}

type PurchaseInfo = {
  PurchasePrice: number;
  AfterRepairValue: number;
  ClosingCost: number;
  EstimatedRepairCost: number;
  LoanDetails: Loan;
}

type Loan = {
  PercentDown: number;
  DownPayment: number ;
  InterestRate: number;
  PointsFromLender: number;
  OtherFeesFromLender: number;
  FeesInLoan: boolean;
  InterestOnly: boolean;
  YearsAmortized: number;
  CapRate: number;
}

type RentalInfo = {
  Income: Income;
  FixedExpenses: FixedExpenses;
  VariableExpenses: VariableExpenses;
  FutureAssumptions: FutureAssumptions;
}        

type FixedExpenses = {
  Electricity: number;
  WaterSewer: number;
  Pmi: number;
  PmiPercentage: number;
  Garbage: number;
  Hoa: number;
  MonthlyInsurance: number;
  PropertyTaxes: number;
  OtherMonthlyExpenses: number;
}

type VariableExpenses = {
  VariableExpenses: number;
  Vacancy: number;
  RepairsMaintenance: number;
  CapitalExpenditures: number;
  ManagementFees: number;
}

type FutureAssumptions = {
  IncomeGrowth: number;
  PvGrowth: number;
  ExpenseGrowth: number;
  SaleExpenses: number;
}

type Income = {
  TotalGrossMonthlyRent: number;
  OtherMonthlyIncome: number;
}

