import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PropertyReport = ({ id }) => {
  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-2 lg:col-span-2">
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-5">
        <Card x-chunk="dashboard-05-chunk-1" className="text-center content-center">
          <CardHeader className="pb-2">
            <CardDescription>ROI</CardDescription>
            <CardTitle className="text-4xl">$1,329</CardTitle>
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
            <CardTitle className="text-4xl">$1,329</CardTitle>
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
              <CardTitle className="text-4xl">$1,329</CardTitle>
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
              <CardTitle className="text-4xl">$1,329</CardTitle>
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
            <CardTitle className="text-4xl">$5,329</CardTitle>
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
              <CardTitle className="text-4xl">$1,329</CardTitle>
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
              <CardTitle className="text-4xl">$1,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex-wrap">
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
            <CardDescription>ChartJS</CardDescription>
            <CardTitle className="text-4xl">CHART</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              pretty
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="flex gap-2">
          <Card x-chunk="dashboard-05-chunk-1" className="text-center">
              <CardHeader className="pb-2">
                <CardDescription>PurchaseInfo</CardDescription>
                <CardTitle className="text-4xl">$500,000</CardTitle>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">Purchase Price</CardFooter>
          </Card>
          <Card className="content-center">
            <div className="mx-28 grid gap-56 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              <div>
                <p><strong>Closing Cost</strong><span className="margin mx-7"></span>regularspace.</p>
                <p><strong>Estimated Repairs</strong><span className="margin mx-2"></span>regularspace.</p>
                <p><strong>Total Project Cost</strong><span className="margin mx-2"></span>regularspace.</p>
                <p><strong>After Repair Value</strong><span className="margin mx-2"></span>regularspace.</p>
              </div>
              <div>
                <p><strong>Down Payment</strong><span className="margin mx-5"></span>regularspace.</p>
                <p><strong>Loan Amount</strong><span className="margin mx-7"></span>regularspace.</p>
                <p><strong>Loan Points</strong><span className="margin mx-9"></span>regularspace.</p>
                <p><strong>Amortized</strong><span className="margin mx-10"></span>regularspace.</p>
              </div>
              <div>
                <p><strong>Closing Cost</strong><span className="margin mx-8"></span>regularspace.</p>
                <p><strong>Monthly ROI</strong><span className="margin mx-8"></span>regularspace.</p>
                <p><strong>Total Cash Needed</strong><span className="margin mx-2"></span>regularspace.</p>
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
                <h5 className="text-center">%</h5>
                <p className="text-center">2% Rule</p>
              </div>
              <div>
                <h5 className="text-center">%</h5>
                <p className="text-center">Total Initial Equity</p>
              </div>
              <div>
                <h5 className="text-center">%</h5>
                <p className="text-center">Gross Rent Multiplier</p>
              </div>
              <div>
                <h5 className="text-center">%</h5>
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
                <h5 className="text-center">%</h5>
                <p className="text-center">Expense Increase</p>
              </div>
              <div>
                <h5 className="text-center">%</h5>
                <p className="text-center">Income Increase</p>
              </div>
              <div>
                <h5 className="text-center">%</h5>
                <p className="text-center">Property Value Increase</p>
              </div>
            </div>
            <div className="pt-14 content-center">
              <Table>
                      <TableHeader>
                        <TableHead>Year 1</TableHead>
                        <TableHead>Year 2</TableHead>
                        <TableHead>Year 5</TableHead>
                        <TableHead>Year 10</TableHead>
                        <TableHead>Year 15</TableHead>
                        <TableHead>Year 20</TableHead>
                        <TableHead>Year 30</TableHead>
                      </TableHeader>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>


  )
}

export default PropertyReport
