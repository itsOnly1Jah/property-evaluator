import { Property } from '@/types'
import useSWR from 'swr'

import {
  MoreHorizontal,
} from "lucide-react"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PropertyTable = () => {
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const {data, error} = useSWR('http://localhost:9080/api/v1/properties', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">
            Down Payment
          </TableHead>
          <TableHead className="hidden md:table-cell">
            Price
          </TableHead>
          <TableHead className="hidden md:table-cell">
            Created at
          </TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((property: Property) => (
          <TableRow key={property.Id}>
            <TableCell className="hidden sm:table-cell">
              <Image
                alt="Product image"
                className="aspect-square rounded-md object-cover"
                height="64"
                src="/house-placeholder.webp"
                width="64"
              />
            </TableCell>
            <TableCell className="font-medium">
              {property.Address.Street}, {property.Address.City}, {property.Address.State} {property.Address.Zipcode}
            </TableCell>
            <TableCell>
              <Badge variant="outline">Draft</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              ${property.PurchaseInfo.PurchasePrice}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {property.Zestimate}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {property.UpdatedBy.Date}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-haspopup="true"
                    size="icon"
                    variant="ghost"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PropertyTable
