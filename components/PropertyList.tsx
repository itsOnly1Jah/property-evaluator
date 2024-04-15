import { Property } from '@/types'
import { MouseEventHandler, MouseEvent} from 'react'
import useSWR from 'swr'

import Link from "next/link"

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
  DropdownMenuSeparator,
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

import { numberWithCommas } from "@/lib/property-evaluator"

const PropertyList = ({ filter }: {filter: string}) => {
  const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR(`http://localhost:9080/api/v1/properties?${filter}`, fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  const deleteProperty = async (e: MouseEventHandler<HTMLAnchorElement, MouseEvent>) => {
    await fetch(`http://localhost:9080/api/v1/properties/${e.target.id}`, {
      method: 'DELETE',
    })
  }

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
              <Badge variant="outline">{property.Status}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              ${numberWithCommas(property.PurchaseInfo.LoanDetails.DownPayment.toFixed(2))}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              ${numberWithCommas(property.PurchaseInfo.PurchasePrice.toFixed(2))}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {Date.parse(property.UpdatedBy.Date).toLocaleString('en-US')}
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/property/${property.Id}`} >Evaluate</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" id={property.Id} onClick={deleteProperty}>Delete</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PropertyList
