import PropertyList from '@/components/PropertyList'

const properties = async () => {
  const res = await fetch('http://localhost:9080/api/v1/properties').then(res => res.json())
  return res
}

const Home = async () => {
  const allProperties = await properties()
  return (
    <div>
      <h1>Property Evaluator</h1>
      <PropertyList properties={allProperties} />
    </div>
  )
}

export default Home 
