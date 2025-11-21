import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import { Car } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function BookingPage() {
  const { carId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [days, setDays] = useState(0)

  useEffect(() => {
    if (carId) {
      fetchCarDetails(carId)
    }
  }, [carId])

  useEffect(() => {
    if (bookingData.startDate && bookingData.endDate && car) {
      const start = new Date(bookingData.startDate)
      const end = new Date(bookingData.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDays(diffDays)
      setTotalPrice(diffDays * car.pricePerDay)
    }
  }, [bookingData.startDate, bookingData.endDate, car])

  const fetchCarDetails = async (id: string) => {
    setLoading(true)
    try {
      const response = await api.get(`/cars/${id}`)
      setCar(response.data.car)
      setBookingData({
        ...bookingData,
        pickupLocation: response.data.car.location,
        dropoffLocation: response.data.car.location,
      })
    } catch (error) {
      console.error('Error fetching car details:', error)
      toast({
        title: 'Error',
        description: 'Failed to load car data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!car) return

    const token = localStorage.getItem('token')
    if (!token) {
      toast({
        title: 'Login Required',
        description: 'Please login to complete the booking',
        variant: 'destructive',
      })
      navigate('/login')
      return
    }

    try {
      const response = await api.post('/reservations', {
        carId: car._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        totalPrice,
        pickupLocation: bookingData.pickupLocation,
        dropoffLocation: bookingData.dropoffLocation,
      })

      toast({
        title: 'Booking Created',
        description: 'Booking created successfully. You will be redirected to the payment page.',
      })

      // Redirect to payment or dashboard
      navigate(`/dashboard?reservation=${response.data.reservation._id}`)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create booking',
        variant: 'destructive',
      })
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
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Booking</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Car Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    {car.images && car.images.length > 0 ? (
                      <img
                        src={car.images[0]}
                        alt={car.name}
                        className="w-24 h-24 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&auto=format&fit=crop&q=80`;
                        }}
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&auto=format&fit=crop&q=80"
                        alt={car.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{car.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {car.brand} • {formatPrice(car.pricePerDay)}/day
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Pickup Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        min={today}
                        value={bookingData.startDate}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            startDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Return Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        min={bookingData.startDate || today}
                        value={bookingData.endDate}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            endDate: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Input
                      id="pickupLocation"
                      value={bookingData.pickupLocation}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          pickupLocation: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dropoffLocation">Dropoff Location</Label>
                    <Input
                      id="dropoffLocation"
                      value={bookingData.dropoffLocation}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          dropoffLocation: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Price Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price per day</span>
                      <span>{formatPrice(car.pricePerDay)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Number of days</span>
                      <span>{days || 0}</span>
                    </div>
                    <div className="border-t pt-2 flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary text-lg">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!bookingData.startDate || !bookingData.endDate}
                  >
                    Complete Booking
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

