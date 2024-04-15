import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const PropertyCard = (
  { dashboard, title, description, content, styling = "" }:
  { dashboard: string, title: string, description: string, content: string, styling: string }
) => {
  return (
    <Card x-chunk={dashboard}>
      <CardHeader className={styling}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong>{" "} products
        </div>
      </CardFooter>
    </Card>
  )
}

export default PropertyCard
