import PropertyCard from "@/components/PropertyCard"
import PurchaseInfo from "@/components/PropertyPurchaseInfo"
import RentalInfo from "@/components/PropertyRentalInfo"
import PropertyReport from "@/components/PropertyReport"

import {
  File,
  Home,
  LineChart,
  ListFilter,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  ShoppingCart,
  Users2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


const PropertyTab = ({ id, defaultTab}) => {
  return (
    <Tabs defaultValue={defaultTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
          <TabsTrigger value="rental">Rental Info</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Archived
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="purchase">
        <PropertyCard
          dashboard="dashboard-06-chunk-0"
          title="Property Evaluator"
          description="Manage your properties and view their projected performance."
          content=<PurchaseInfo id={id} />
        />
      </TabsContent>
      <TabsContent value="rental">
        <PropertyCard
          dashboard="dashboard-06-chunk-0"
          title="Property Evaluator"
          description="Manage your properties and view their projected performance."
          content=<RentalInfo id={id} />
        />
      </TabsContent>
      <TabsContent value="report">
        <PropertyCard
          dashboard="dashboard-06-chunk-0"
          title="Property Evaluator"
          description="Manage your properties and view their projected performance."
          content=<PropertyReport id={id} />
        />
      </TabsContent>
      <TabsContent value="all">
        <PropertyCard
          dashboard="dashboard-06-chunk-0"
          title="Property Evaluator"
          description="Manage your properties and view their projected performance."
          content=<PurchaseInfo id={id} />
        />
      </TabsContent>
    </Tabs>
  )
}

export default PropertyTab
