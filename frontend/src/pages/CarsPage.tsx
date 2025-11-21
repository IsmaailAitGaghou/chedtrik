import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {  Users, Fuel, Cog } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Car, Filter } from 'lucide-react'
import api from '@/lib/api'
import { Car as CarType, CarFilters } from '@/types'
import { formatPrice } from '@/lib/utils'

export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [cars, setCars] = useState<CarType[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CarFilters>({
    type: searchParams.get('type') || '',
    brand: searchParams.get('brand') || '',
    fuel: searchParams.get('fuel') || '',
    transmission: searchParams.get('transmission') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    seats: searchParams.get('seats') ? Number(searchParams.get('seats')) : undefined,
    availability: true,
  })
  const [selectValues, setSelectValues] = useState({
    type: searchParams.get('type') || 'all',
    brand: searchParams.get('brand') || 'all',
    fuel: searchParams.get('fuel') || 'all',
    transmission: searchParams.get('transmission') || 'all',
  })
  const [brands, setBrands] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])

  useEffect(() => {
    fetchCars()
    fetchBrands()
    fetchTypes()
  }, [filters])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value))
        }
      })
      const response = await api.get(`/cars?${params.toString()}`)
      console.log('Cars response:', response.data)
      setCars(response.data.cars || response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching cars:', error)
      console.error('Error details:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await api.get('/cars/brands')
      console.log('Brands response:', response.data)
      setBrands(response.data.brands || response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching brands:', error)
      console.error('Error details:', error.response?.data || error.message)
    }
  }

  const fetchTypes = async () => {
    try {
      const response = await api.get('/cars/types')
      console.log('Types response:', response.data)
      setTypes(response.data.types || response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching types:', error)
      console.error('Error details:', error.response?.data || error.message)
    }
  }

  const handleFilterChange = (key: keyof CarFilters, value: any) => {
    // Convert "all" to empty string for filtering
    const filterValue = value === 'all' ? '' : value
    setFilters({ ...filters, [key]: filterValue })
    setSelectValues({ ...selectValues, [key]: value })
    const newParams = new URLSearchParams(searchParams)
    if (filterValue) {
      newParams.set(key, String(filterValue))
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      brand: '',
      fuel: '',
      transmission: '',
      availability: true,
    })
    setSelectValues({
      type: 'all',
      brand: 'all',
      fuel: 'all',
      transmission: 'all',
    })
    setSearchParams({})
  }

  const typeLabels: Record<string, string> = {
    compact: 'Compact',
    suv: 'SUV',
    berline: 'Sedan',
    break: 'Station Wagon',
    utilitaire: 'Utility',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Explore Our Fleet
          </h1>
          <p className="text-lg text-gray-600">
            Choose from a wide range of luxury cars tailored to your needs
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-xl bg-white sticky top-24">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold flex items-center text-gray-900">
                  <Filter className="h-5 w-5 mr-2 text-primary" />
                  Filters
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-primary hover:bg-primary/10"
                >
                  Clear All
                </Button>
              </div>

              {/* Type Filter */}
              <div>
                <Label>Type</Label>
                <Select
                  value={selectValues.type}
                  onValueChange={(value) => handleFilterChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {typeLabels[type] || type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Brand Filter */}
              <div>
                <Label>Brand</Label>
                <Select
                  value={selectValues.brand}
                  onValueChange={(value) => handleFilterChange('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Filter */}
              <div>
                <Label>Fuel Type</Label>
                <Select
                  value={selectValues.fuel}
                  onValueChange={(value) => handleFilterChange('fuel', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="essence">Gasoline</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="electrique">Electric</SelectItem>
                    <SelectItem value="hybride">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission Filter */}
              <div>
                <Label>Transmission</Label>
                <Select
                  value={selectValues.transmission}
                  onValueChange={(value) => handleFilterChange('transmission', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="automatique">Automatic</SelectItem>
                    <SelectItem value="manuel">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>Price (MAD/day)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) =>
                      handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ''}
                    onChange={(e) =>
                      handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                    }
                  />
                </div>
              </div>

              {/* Seats Filter */}
              <div>
                <Label>Number of Seats</Label>
                <Input
                  type="number"
                  min="2"
                  max="9"
                  placeholder="Number of seats"
                  value={filters.seats || ''}
                  onChange={(e) =>
                    handleFilterChange('seats', e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cars Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600 text-lg">Loading cars...</p>
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <Car className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cars.map((car) => (
                <Link key={car._id} to={`/cars/${car._id}`}>
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border-0 shadow-lg bg-white">
                  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&auto=format&fit=crop&q=80`;
                        }}
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&auto=format&fit=crop&q=80"
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-gradient-blue text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg">
                      {formatPrice(car.pricePerDay)}/day
                    </div>
                    {car.availability && (
                      <div className="absolute top-4 left-4 border border-green-400 bg-green-200 text-green-500 px-2 py-1 rounded-full text-[10px]  font-semibold">
                        Available
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 bg-white">
                    <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-primary transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 font-medium">
                      {car.brand} • {car.type}
                    </p>
                    <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                      <span className="text-gray-600 flex items-center gap-1 font-medium">
                      <Users className="h-4 w-4 text-gray-600" /> {car.seats} seats
                      </span>
                      <span className="text-gray-600 flex items-center gap-1 font-medium">
                      <Cog className="h-4 w-4 text-gray-600" /> {car.transmission === 'automatique' ? 'Automatic' : 'Manual'}
                      </span>
                      <span className="text-gray-600 flex items-center gap-1 font-medium">
                      <Fuel className="h-4 w-4 text-gray-600" /> {car.fuel === 'electrique' ? 'Electric' : car.fuel}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}

