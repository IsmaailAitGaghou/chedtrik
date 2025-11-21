import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Calendar, MapPin, Clock, CheckCircle, XCircle, Users, TrendingUp, Trash2, UserCheck, UserX } from 'lucide-react'
import api from '@/lib/api'
import { Reservation, User } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [allCars, setAllCars] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'users' | 'cars'>('overview')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchUserProfile()
  }, [navigate])

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        fetchAdminData()
      } else {
        fetchReservations()
      }
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/profile')
      setUser(response.data.user)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchReservations = async () => {
    setLoading(true)
    try {
      const response = await api.get('/reservations')
      setReservations(response.data.reservations || response.data.data || [])
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminData = async () => {
    setLoading(true)
    try {
      const [reservationsRes, usersRes, carsRes, statsRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/admin/users'),
        api.get('/cars'),
        api.get('/reservations/stats')
      ])
      setReservations(reservationsRes.data.reservations || reservationsRes.data.data || [])
      setAllUsers(usersRes.data.data || usersRes.data.users || [])
      setAllCars(carsRes.data.cars || carsRes.data.data || [])
      setStats(statsRes.data.data || statsRes.data || {})
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load admin data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`)
      toast({
        title: 'Success',
        description: 'User status updated successfully',
      })
      fetchAdminData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update user status',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${userId}`)
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      })
      fetchAdminData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete user',
        variant: 'destructive',
      })
    }
  }

  const handleCancelReservation = async (id: string) => {
    try {
      await api.patch(`/reservations/${id}/cancel`)
      toast({
        title: 'Cancelled',
        description: 'Reservation cancelled successfully',
      })
      fetchReservations()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel reservation',
        variant: 'destructive',
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'confirmed':
        return 'Confirmed'
      case 'cancelled':
        return 'Cancelled'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Admin Dashboard
  if (user?.role === 'admin') {
    return (
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome {user?.name}, manage your car rental platform
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">{allUsers.length}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reservations</p>
                    <p className="text-3xl font-bold">{stats.totalReservations || 0}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cars</p>
                    <p className="text-3xl font-bold">{allCars.length}</p>
                  </div>
                  <Car className="h-10 w-10 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-3xl font-bold">{formatPrice(stats.totalRevenue || 0)}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-amber-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'reservations'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Reservations ({reservations.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Users ({allUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('cars')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'cars'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Cars ({allCars.length})
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reservation Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pending</span>
                      <span className="font-bold">{stats.pendingReservations || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Confirmed</span>
                      <span className="font-bold text-green-600">{stats.confirmedReservations || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-bold text-blue-600">{stats.completedReservations || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cancelled</span>
                      <span className="font-bold text-red-600">{stats.cancelledReservations || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/cars" className="block">
                    <Button className="w-full" variant="outline">
                      <Car className="h-4 w-4 mr-2" />
                      Manage Cars
                    </Button>
                  </Link>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab('reservations')}>
                    <Calendar className="h-4 w-4 mr-2" />
                    View All Reservations
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => setActiveTab('users')}>
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No reservations found</p>
                </CardContent>
              </Card>
            ) : (
              reservations.map((reservation) => {
                const car = typeof reservation.carId === 'object' ? reservation.carId : null
                const reservationUser = typeof reservation.userId === 'object' ? reservation.userId : null
                return (
                  <Card key={reservation._id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {car && car.images && car.images.length > 0 ? (
                          <img
                            src={car.images[0]}
                            alt={car.name}
                            className="w-full md:w-48 h-48 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=600&auto=format&fit=crop&q=80`;
                            }}
                          />
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=600&auto=format&fit=crop&q=80"
                            alt={car?.name || 'Car'}
                            className="w-full md:w-48 h-48 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold mb-1">
                                {car?.name || 'Car'}
                              </h3>
                              <p className="text-muted-foreground">
                                {car?.brand} • {formatPrice(reservation.totalPrice)}
                              </p>
                              {reservationUser && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Customer: {reservationUser.name} ({reservationUser.email})
                                </p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(reservation.status)}
                              <span className="font-semibold">
                                {getStatusLabel(reservation.status)}
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground">From</p>
                                <p className="font-semibold">{formatDate(reservation.startDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-muted-foreground">To</p>
                                <p className="font-semibold">{formatDate(reservation.endDate)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {allUsers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {allUsers.map((u) => (
                  <Card key={u._id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{u.name}</h3>
                          <p className="text-muted-foreground">{u.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {u.role}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleUserStatus(u._id)}
                          >
                            {u.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          {u.role !== 'admin' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCars.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No cars found</p>
                </CardContent>
              </Card>
            ) : (
              allCars.map((car) => (
                <Link key={car._id} to={`/cars/${car._id}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="relative h-48">
                        {car.images && car.images.length > 0 ? (
                          <img
                            src={car.images[0]}
                            alt={car.name}
                            className="w-full h-full object-cover rounded-t-lg"
                            onError={(e) => {
                              e.currentTarget.src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=600&auto=format&fit=crop&q=80`;
                            }}
                          />
                        ) : (
                          <img
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=600&auto=format&fit=crop&q=80"
                            alt={car.name}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{car.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{car.brand} • {car.type}</p>
                        <p className="font-bold text-primary">{formatPrice(car.pricePerDay)}/day</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  // User Dashboard
  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome {user?.name}, here are your reservations
        </p>
      </div>

      {/* User Info */}
      <Card className="mb-6 max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            {user?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{user.phone}</p>
              </div>
            )}
            {user?.address && (
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-semibold">{user.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reservations */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Reservations</h2>
          <Link to="/cars">
            <Button>Book New Car</Button>
          </Link>
        </div>

        {reservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No reservations yet
              </p>
              <Link to="/cars">
                <Button>Explore Cars</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => {
              const car = typeof reservation.carId === 'object' ? reservation.carId : null
              return (
                <Card key={reservation._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {car && car.images && car.images.length > 0 ? (
                        <img
                          src={car.images[0]}
                          alt={car.name}
                          className="w-full md:w-48 h-48 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = `https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=600&auto=format&fit=crop&q=80`;
                          }}
                        />
                      ) : (
                        <img
                          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=600&auto=format&fit=crop&q=80"
                          alt={car?.name || 'Car'}
                          className="w-full md:w-48 h-48 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">
                              {car?.name || 'Car'}
                            </h3>
                            <p className="text-muted-foreground">
                              {car?.brand} • {formatPrice(reservation.totalPrice)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(reservation.status)}
                            <span className="font-semibold">
                              {getStatusLabel(reservation.status)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">From</p>
                              <p className="font-semibold">
                                {formatDate(reservation.startDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">To</p>
                              <p className="font-semibold">
                                {formatDate(reservation.endDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Pickup</p>
                              <p className="font-semibold">
                                {reservation.pickupLocation}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground">Dropoff</p>
                              <p className="font-semibold">
                                {reservation.dropoffLocation}
                              </p>
                            </div>
                          </div>
                        </div>

                        {reservation.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelReservation(reservation._id)}
                            >
                              Cancel Reservation
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

