import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const PropertyBreadCrumb = ({ links, currentPage }: { links: { route: string, title: string }[], currentPage: string }) => {

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {links.map((link) =>
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={link.route}>{link.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
      </BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbPage>{currentPage}</BreadcrumbPage>
      </BreadcrumbItem>
    </Breadcrumb>
  )
}

export default PropertyBreadCrumb
