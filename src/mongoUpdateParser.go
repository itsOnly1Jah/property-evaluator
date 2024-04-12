package main

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func mongoUpdateParser(d Property) []primitive.E {

	var updates []bson.E

	if d.Address.Street != "" {
		updates = append(updates, bson.E{"Address.Street", d.Address.Street})
	}
	if d.Address.Zipcode != "" {
		updates = append(updates, bson.E{"Address.Zipcode", d.Address.Zipcode})
	}
	if d.Address.City != "" {
		updates = append(updates, bson.E{"Address.City", d.Address.City})
	}
	if d.Address.State != "" {
		updates = append(updates, bson.E{"Address.State", d.Address.State})
	}

	if d.PurchaseInfo.PurchasePrice != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.PurchasePrice", d.PurchaseInfo.PurchasePrice})
	}
	if d.PurchaseInfo.AfterRepairValue != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.AfterRepairValue", d.PurchaseInfo.AfterRepairValue})
	}
	if d.PurchaseInfo.ClosingCost != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.ClosingCost", d.PurchaseInfo.ClosingCost})
	}
	if d.PurchaseInfo.EstimatedRepairCost != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.EstimatedRepairCost", d.PurchaseInfo.EstimatedRepairCost})
	}

	if d.PurchaseInfo.LoanDetails.PercentDown != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.PercentDown", d.PurchaseInfo.LoanDetails.PercentDown})
	}
	if d.PurchaseInfo.LoanDetails.DownPayment != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.DownPayment", d.PurchaseInfo.LoanDetails.DownPayment})
	}
	if d.PurchaseInfo.LoanDetails.InterestRate != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.InterestRate", d.PurchaseInfo.LoanDetails.InterestRate})
	}
	if d.PurchaseInfo.LoanDetails.PointsFromLender != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.PointsFromLender", d.PurchaseInfo.LoanDetails.PointsFromLender})
	}
	if d.PurchaseInfo.LoanDetails.OtherFeesFromLender != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.OtherFeesFromLender", d.PurchaseInfo.LoanDetails.OtherFeesFromLender})
	}
	if d.PurchaseInfo.LoanDetails.FeesInLoan != false {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.FeesInLoan", d.PurchaseInfo.LoanDetails.FeesInLoan})
	}
	if d.PurchaseInfo.LoanDetails.InterestOnly != false {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.InterestOnly", d.PurchaseInfo.LoanDetails.InterestOnly})
	}
	if d.PurchaseInfo.LoanDetails.YearsAmortized != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.YearsAmortized", d.PurchaseInfo.LoanDetails.YearsAmortized})
	}
	if d.PurchaseInfo.LoanDetails.CapRate != 0 {
		updates = append(updates, bson.E{"PurchaseInfo.LoanDetails.CapRate", d.PurchaseInfo.LoanDetails.CapRate})
	}

	if d.RentalInfo.Income.TotalGrossMonthlyRent != 0 {
		updates = append(updates, bson.E{"RentalInfo.Income.TotalGrossMonthlyRent", d.RentalInfo.Income.TotalGrossMonthlyRent})
	}
	if d.RentalInfo.Income.OtherMonthlyIncome != 0 {
		updates = append(updates, bson.E{"RentalInfo.Income.OtherMonthlyIncome", d.RentalInfo.Income.OtherMonthlyIncome})
	}

	if d.RentalInfo.FixedExpenses.Electricity != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.Electricity", d.RentalInfo.FixedExpenses.Electricity})
	}
	if d.RentalInfo.FixedExpenses.WaterSewer != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.WaterSewer", d.RentalInfo.FixedExpenses.WaterSewer})
	}
	if d.RentalInfo.FixedExpenses.Pmi != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.Pmi", d.RentalInfo.FixedExpenses.Pmi})
	}
	if d.RentalInfo.FixedExpenses.PmiPercentage != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.PmiPercentage", d.RentalInfo.FixedExpenses.PmiPercentage})
	}
	if d.RentalInfo.FixedExpenses.Garbage != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.Garbage", d.RentalInfo.FixedExpenses.Garbage})
	}
	if d.RentalInfo.FixedExpenses.Hoa != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.Hoa", d.RentalInfo.FixedExpenses.Hoa})
	}
	if d.RentalInfo.FixedExpenses.MonthlyInsurance != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.MonthlyInsurance", d.RentalInfo.FixedExpenses.MonthlyInsurance})
	}
	if d.RentalInfo.FixedExpenses.PropertyTaxes != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.PropertyTaxes", d.RentalInfo.FixedExpenses.PropertyTaxes})
	}
	if d.RentalInfo.FixedExpenses.OtherMonthlyExpenses != 0 {
		updates = append(updates, bson.E{"RentalInfo.FixedExpenses.OtherMonthlyExpenses", d.RentalInfo.FixedExpenses.OtherMonthlyExpenses})
	}

	if d.RentalInfo.VariableExpenses.Vacancy != 0 {
		updates = append(updates, bson.E{"RentalInfo.VariableExpenses.Vacancy", d.RentalInfo.VariableExpenses.Vacancy})
	}
	if d.RentalInfo.VariableExpenses.RepairsMaintenance != 0 {
		updates = append(updates, bson.E{"RentalInfo.VariableExpenses.RepairsMaintenance", d.RentalInfo.VariableExpenses.RepairsMaintenance})
	}
	if d.RentalInfo.VariableExpenses.CapitalExpenditures != 0 {
		updates = append(updates, bson.E{"RentalInfo.VariableExpenses.CapitalExpenditures", d.RentalInfo.VariableExpenses.CapitalExpenditures})
	}
	if d.RentalInfo.VariableExpenses.ManagementFees != 0 {
		updates = append(updates, bson.E{"RentalInfo.VariableExpenses.ManagementFees", d.RentalInfo.VariableExpenses.ManagementFees})
	}

	if d.RentalInfo.FutureAssumptions.IncomeGrowth != 0 {
		updates = append(updates, bson.E{"RentalInfo.FutureAssumptions.IncomeGrowth", d.RentalInfo.FutureAssumptions.IncomeGrowth})
	}
	if d.RentalInfo.FutureAssumptions.PvGrowth != 0 {
		updates = append(updates, bson.E{"RentalInfo.FutureAssumptions.PvGrowth", d.RentalInfo.FutureAssumptions.PvGrowth})
	}
	if d.RentalInfo.FutureAssumptions.ExpenseGrowth != 0 {
		updates = append(updates, bson.E{"RentalInfo.FutureAssumptions.ExpenseGrowth", d.RentalInfo.FutureAssumptions.ExpenseGrowth})
	}
	if d.RentalInfo.FutureAssumptions.SaleExpenses != 0 {
		updates = append(updates, bson.E{"RentalInfo.FutureAssumptions.SaleExpenses", d.RentalInfo.FutureAssumptions.SaleExpenses})
	}

	if d.Zestimate != 0 {
		updates = append(updates, bson.E{"Zestimate", d.Zestimate})
	}

	//if d.LastSoldDate != 0 {
	//	updates = append(updates, bson.E{"LastSoldDate", d.LastSoldDate})
	//}

	if d.LastSoldPrice != 0 {
		updates = append(updates, bson.E{"LastSoldPrice", d.LastSoldPrice})
	}

	//if d.PurchaseInfo != "" {
	//	updates = append(updates, bson.E{"CreatedBy", d.CreatedBy})
	//}
	//if d.PurchaseInfo != "" {
	//	updates = append(updates, bson.E{"UpdatedBy", d.UpdatedBy})
	//}

	if d.Status != "" {
		updates = append(updates, bson.E{"Status", d.Status})
	}

	return updates
}
