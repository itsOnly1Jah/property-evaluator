import useSWR from 'swr'

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


const PropertyTab = ({ id, defaultTab }: {id: string, defaultTab: string}) => {

  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?_id=${id}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <Tabs defaultValue={defaultTab}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
          <TabsTrigger value="rental">Rental Info</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Export
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="purchase">
        <PropertyCard
          dashboard="dashboard-06-chunk-0"
          title={data[0].Address.Street}
          description={`${data[0].Address.City}, ${data[0].Address.State}, ${data[0].Address.Zipcode}`}
          content=<PurchaseInfo id={id} />
          styling="text-center"
        />
      </TabsContent>
      <TabsContent value="rental">
        <PropertyCard
          dashboard="dashboard-06-chunk-0"
          title={data[0].Address.Street}
          description={`${data[0].Address.City}, ${data[0].Address.State}, ${data[0].Address.Zipcode}`}
          content=<RentalInfo id={id} />
          styling="text-center"
        />
      </TabsContent>
      <TabsContent value="report">
        <PropertyCard
          dashboard="dashboard-06-chunk-0"
          title={data[0].Address.Street}
          description={`${data[0].Address.City}, ${data[0].Address.State}, ${data[0].Address.Zipcode}`}
          content=<PropertyReport id={id} />
          styling="text-center"
        />
      </TabsContent>
    </Tabs>
  )
}

export default PropertyTab
