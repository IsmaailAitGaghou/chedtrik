import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Users, Fuel, Settings, ArrowRight, Check } from 'lucide-react'
import api from '@/lib/api'
import { Car as CarType } from '@/types'
import { formatPrice } from '@/lib/utils'

export default function CarDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState<CarType | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (id) {
      fetchCarDetails(id)
    }
  }, [id])

  const fetchCarDetails = async (carId: string) => {
    setLoading(true)
    try {
      const response = await api.get(`/cars/${carId}`)
      setCar(response.data.car)
    } catch (error) {
      console.error('Error fetching car details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-muted-foreground">Car not found</p>
        <Link to="/cars">
          <Button className="mt-4">Back to Cars</Button>
        </Link>
      </div>
    )
  }

  const typeLabels: Record<string, string> = {
    compact: 'Compact',
    suv: 'SUV',
    berline: 'Sedan',
    break: 'Station Wagon',
    utilitaire: 'Utility',
  }

  const fuelLabels: Record<string, string> = {
    essence: 'Gasoline',
    diesel: 'Diesel',
    electrique: 'Electric',
    hybride: 'Hybrid',
  }

  const handleBookNow = () => {
    navigate(`/booking/${car._id}`)
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="relative h-96 bg-muted">
                {car.images && car.images.length > 0 ? (
                  <>
                    <img
                      src={car.images[selectedImage]}
                      alt={car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&auto=format&fit=crop&q=80`;
                      }}
                    />
                    {car.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {car.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`w-2 h-2 rounded-full ${
                              selectedImage === index
                                ? 'bg-primary'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=800&auto=format&fit=crop&q=80"
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {car.images && car.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 p-4">
                  {car.images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded overflow-hidden border-2 ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${car.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&auto=format&fit=crop&q=80`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Car Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{car.name}</CardTitle>
              <p className="text-muted-foreground">
                {car.brand} • {typeLabels[car.type] || car.type}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {car.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{car.description}</p>
                </div>
              )}

              {/* Specifications */}
              <div>
                <h3 className="font-semibold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <p className="font-semibold">{car.seats}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-semibold">
                        {car.transmission === 'automatique' ? 'Automatic' : 'Manual'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel</p>
                      <p className="font-semibold">
                        {fuelLabels[car.fuel] || car.fuel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{car.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {car.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2"
                      >
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Book Now</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price per day</p>
                <p className="text-3xl font-bold text-primary">
                  {formatPrice(car.pricePerDay)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`font-semibold ${
                      car.availability ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {car.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold">{car.location}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleBookNow}
                disabled={!car.availability}
              >
                Book Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              {!car.availability && (
                <p className="text-sm text-center text-muted-foreground">
                  This car is currently unavailable
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

