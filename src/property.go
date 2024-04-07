package main

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Property struct {
    Id primitive.ObjectID `bson:"_id"`
    Address Address
    PurchaseInfo PurchaseInfo
    RentalInfo RentalInfo
    Zestimate float64
    LastSoldDate primitive.DateTime
    LastSoldPrice float64
    CreatedBy User
    UpdatedBy User
}

type Address struct {
  Street string
  Zipcode string
  City string
  State string
}

type PurchaseInfo struct {
  PurchasePrice float64
  AfterRepairValue float64
  ClosingCost float64
  EstimatedRepairCost float64
  LoanDetails Loan
}

type Loan struct {
  PercentDown float64
  DownPayment float64 
  InterestRate float64
  PointsFromLender int
  OtherFeesFromLender int
  FeesInLoan bool
  InterestOnly bool
  YearsAmortized int
  CapRate float64
}

type RentalInfo struct {
  Income Income
  FixedExpenses FixedExpenses
  VariableExpenses VariableExpenses
  FutureAssumptions FutureAssumptions
}        

type FixedExpenses struct {
  Electricity float64
  WaterSewer float64
  Pmi float64
  PmiPercentage float64
  Garbage float64
  Hoa float64
  MonthlyInsurance float64
  PropertyTaxes float64
  OtherMonthlyExpenses float64
}

type VariableExpenses struct {
  Vacancy float64
  RepairsMaintenance float64
  CapitalExpenditures float64
  ManagementFees float64
}

type FutureAssumptions struct {
  IncomeGrowth float64
  PvGrowth float64
  ExpenseGrowth float64
  SaleExpenses float64
}

type Income struct {
  TotalGrossMonthlyRent int
  OtherMonthlyIncome int
}
