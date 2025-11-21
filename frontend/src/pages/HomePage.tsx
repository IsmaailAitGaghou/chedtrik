import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Calendar, MapPin, ArrowRight, Crown, ShieldCheck, Sparkles, CheckCircle2, Star, Award, Users, Fuel, Cog } from 'lucide-react'
import api from '@/lib/api'
import { Car as CarType } from '@/types'
import { formatPrice } from '@/lib/utils'

export default function HomePage() {
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set())
  const [searchParams, setSearchParams] = useState({
    location: '',
    startDate: '',
    endDate: '',
  })

  useEffect(() => {
    fetchFeaturedCars()
    fetchBrands()
  }, [])

  const fetchFeaturedCars = async () => {
    try {
      const response = await api.get('/cars?availability=true&limit=4')
      console.log('Cars response:', response.data)
      setFeaturedCars(response.data.cars || response.data.data || [])
    } catch (error: any) {
      console.error('Error fetching cars:', error)
      console.error('Error details:', error.response?.data || error.message)
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

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchParams.location) params.append('location', searchParams.location)
    if (searchParams.startDate) params.append('startDate', searchParams.startDate)
    if (searchParams.endDate) params.append('endDate', searchParams.endDate)
    window.location.href = `/cars?${params.toString()}`
  }

  // Function to get brand logo URL
  const getBrandLogo = (brandName: string): string => {
    const brandLower = brandName.toLowerCase().trim()
    const brandLogos: Record<string, string> = {
      'mercedes': 'https://logos-world.net/wp-content/uploads/2020/05/Mercedes-Benz-Logo.png',
      'mercedes-benz': 'https://logos-world.net/wp-content/uploads/2020/05/Mercedes-Benz-Logo.png',
      'bmw': 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png',
      'audi': 'https://logos-world.net/wp-content/uploads/2021/04/Audi-Logo-500x281.png',
      'porsche': 'https://logos-world.net/wp-content/uploads/2022/02/Porsche-Logo.png',
      'ferrari': 'https://logos-world.net/wp-content/uploads/2020/06/Ferrari-Logo.png',
      'lamborghini': 'https://logos-world.net/wp-content/uploads/2020/06/Lamborghini-Logo.png',
      'tesla': 'https://logos-world.net/wp-content/uploads/2021/04/Tesla-Logo-700x394.png',
      'range rover': 'https://logos-world.net/wp-content/uploads/2020/05/Land-Rover-Logo.png',
      'land rover': 'https://logos-world.net/wp-content/uploads/2021/03/Landrover-Logo-500x281.png',
      'jaguar': 'https://logos-world.net/wp-content/uploads/2022/02/Jaguar-Logo-700x394.png',
      'lexus': 'https://logos-world.net/wp-content/uploads/2020/05/Lexus-Logo.png',
      'toyota': 'https://logos-world.net/wp-content/uploads/2020/05/Toyota-Logo.png',
      'honda': 'https://logos-world.net/wp-content/uploads/2020/05/Honda-Logo.png',
      'nissan': 'https://logos-world.net/wp-content/uploads/2020/05/Nissan-Logo.png',
      'ford': 'https://logos-world.net/wp-content/uploads/2020/05/Ford-Logo.png',
      'volkswagen': 'https://logos-world.net/wp-content/uploads/2020/05/Volkswagen-Logo.png',
      'vw': 'https://logos-world.net/wp-content/uploads/2020/05/Volkswagen-Logo.png',
      'peugeot': 'https://logos-world.net/wp-content/uploads/2022/02/Peugeot-Logo.png',
      'renault': 'https://logos-world.net/wp-content/uploads/2020/05/Renault-Logo.png',
      'citroen': 'https://logos-world.net/wp-content/uploads/2020/05/Citroen-Logo.png',
      'opel': 'https://logos-world.net/wp-content/uploads/2020/05/Opel-Logo.png',
      'volvo': 'https://logos-world.net/wp-content/uploads/2021/03/Volvo-Logo-500x281.png',
      'hyundai': 'https://logos-world.net/wp-content/uploads/2020/05/Hyundai-Logo.png',
      'kia': 'https://logos-world.net/wp-content/uploads/2020/05/Kia-Logo.png',
      'mazda': 'https://logos-world.net/wp-content/uploads/2020/05/Mazda-Logo.png',
      'subaru': 'https://logos-world.net/wp-content/uploads/2020/05/Subaru-Logo.png',
      'mitsubishi': 'https://logos-world.net/wp-content/uploads/2020/05/Mitsubishi-Logo.png',
      'suzuki': 'https://logos-world.net/wp-content/uploads/2020/05/Suzuki-Logo.png',
      'seat': 'https://logos-world.net/wp-content/uploads/2020/05/SEAT-Logo.png',
      'skoda': 'https://logos-world.net/wp-content/uploads/2020/05/Skoda-Logo.png',
      'fiat': 'https://logos-world.net/wp-content/uploads/2020/05/Fiat-Logo.png',
      'alfa romeo': 'https://logos-world.net/wp-content/uploads/2020/05/Alfa-Romeo-Logo.png',
      'maserati': 'https://logos-world.net/wp-content/uploads/2020/05/Maserati-Logo.png',
      'bentley': 'https://logos-world.net/wp-content/uploads/2020/05/Bentley-Logo.png',
      'rolls-royce': 'https://logos-world.net/wp-content/uploads/2020/05/Rolls-Royce-Logo.png',
      'rolls royce': 'https://logos-world.net/wp-content/uploads/2020/05/Rolls-Royce-Logo.png',
      'mclaren': 'https://logos-world.net/wp-content/uploads/2020/05/McLaren-Logo.png',
      'aston martin': 'https://logos-world.net/wp-content/uploads/2020/05/Aston-Martin-Logo.png',
      'mini': 'https://logos-world.net/wp-content/uploads/2020/05/Mini-Logo.png',
      'jeep': 'https://logos-world.net/wp-content/uploads/2020/05/Jeep-Logo.png',
      'dodge': 'https://logos-world.net/wp-content/uploads/2020/05/Dodge-Logo.png',
      'chevrolet': 'https://logos-world.net/wp-content/uploads/2020/05/Chevrolet-Logo.png',
      'cadillac': 'https://logos-world.net/wp-content/uploads/2020/05/Cadillac-Logo.png',
      'infiniti': 'https://logos-world.net/wp-content/uploads/2020/05/Infiniti-Logo.png',
      'acura': 'https://logos-world.net/wp-content/uploads/2020/05/Acura-Logo.png',
      'genesis': 'https://logos-world.net/wp-content/uploads/2020/05/Genesis-Logo.png',
    }
    
    // Try exact match first
    if (brandLogos[brandLower]) {
      return brandLogos[brandLower]
    }
    
    // Try partial match
    for (const [key, url] of Object.entries(brandLogos)) {
      if (brandLower.includes(key) || key.includes(brandLower)) {
        return url
      }
    }
    
    // Fallback: use clearbit API for brand logos
    return `https://logo.clearbit.com/${brandName.toLowerCase().replace(/\s+/g, '')}.com`
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&h=1080&auto=format&fit=crop&q=80"
            alt="Luxury Car"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-3xl md:text-4xl lg:text-6xl mt-16 lg:mt-0 font-bold tracking-tight text-white">
                Discover
                <span className="block bg-gradient-to-r from-blue-300 via-blue-700 to-blue-300 bg-clip-text text-transparent mt-2">
                  Luxury Cars
                </span>
                <span className="block text-white/90 text-3xl md:text-4xl mt-4 font-light">
                  in Morocco
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Experience the epitome of elegance and performance. 
                <span className="block mt-2 text-gray-400">
                  Premium vehicles for your extraordinary journey.
                </span>
              </p>
            </div>

            {/* Search Bar */}
            <Card className="mt-12 shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Location</label>
                    </div>
                    <Input
                      placeholder="Enter location"
                      value={searchParams.location}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, location: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Pickup Date</label>
                    </div>
                    <Input
                      type="date"
                      value={searchParams.startDate}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <label className="text-sm font-medium">Return Date</label>
                    </div>
                    <Input
                      type="date"
                      value={searchParams.endDate}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, endDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      className="w-full h-12 bg-gradient-blue hover:from-blue-700 hover:to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <Search className="h-5 w-5 mr-2" />
                      Search Cars
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Brands Slider Section */}
      {brands.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Our Premium Brands
              </h2>
              <p className="text-gray-400 text-sm md:text-base">
                Explore vehicles from the world's most trusted manufacturers
              </p>
            </div> */}
            
            {/* Slider Container */}
            <div className="relative overflow-hidden">
              {/* Gradient Overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-800 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-800 to-transparent z-10 pointer-events-none"></div>
              
              {/* Slider */}
              <div className="flex animate-scroll">
                {/* First set of brands */}
                <div className="flex space-x-6 pr-6">
                  {brands.map((brand, index) => {
                    const logoFailed = failedLogos.has(brand)
                    return (
                      <div
                        key={`brand-1-${index}`}
                        className="flex-shrink-0 flex items-center justify-center px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 min-w-[140px] h-[100px]"
                      >
                        {!logoFailed ? (
                          <img
                            src={getBrandLogo(brand)}
                            alt={brand}
                            className="max-w-[120px] max-h-[60px] object-contain filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                            onError={() => {
                              setFailedLogos(prev => new Set(prev).add(brand))
                            }}
                          />
                        ) : (
                          <span className="text-white text-lg font-bold tracking-wide text-center">
                            {brand}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="flex space-x-6 pr-6" aria-hidden="true">
                  {brands.map((brand, index) => {
                    const logoFailed = failedLogos.has(brand)
                    return (
                      <div
                        key={`brand-2-${index}`}
                        className="flex-shrink-0 flex items-center justify-center px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300 min-w-[140px] h-[100px]"
                      >
                        {!logoFailed ? (
                          <img
                            src={getBrandLogo(brand)}
                            alt={brand}
                            className="max-w-[120px] max-h-[60px] object-contain filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                            onError={() => {
                              setFailedLogos(prev => new Set(prev).add(brand))
                            }}
                          />
                        ) : (
                          <span className="text-white text-lg font-bold tracking-wide text-center">
                            {brand}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Add custom animation styles */}
          <style>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-scroll {
              animation: scroll 20s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
        </section>
      )}

      {/* Features Section */}
      <section className="py-14 bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 rounded-full blur-3xl opacity-50"></div>
                <div className="relative p-4">
                  <Crown className="h-16 w-16 text-amber-600 stroke-[1.5] fill-amber-50" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                Award-winning fleet of luxury vehicles, meticulously maintained and verified
              </p>
            </div>
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
                <div className="relative p-4">
                  <ShieldCheck className="h-16 w-16 text-blue-600 stroke-[1.5] fill-blue-50" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Fully Insured</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                Complete protection and peace of mind with comprehensive insurance coverage
              </p>
            </div>
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 rounded-full blur-3xl opacity-50"></div>
                <div className="relative p-4">
                  <Sparkles className="h-16 w-16 text-purple-600 stroke-[1.5] fill-purple-50" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Exclusive Experience</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                Effortless booking process designed for discerning clients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-gray-100 via-white to-white relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Us</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the difference of premium car rental service in Morocco
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-blue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Fleet Selection</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Choose from an extensive collection of luxury vehicles from world-renowned brands, all meticulously maintained to the highest standards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-blue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Star className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Exceptional Service</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our dedicated team ensures a seamless experience from booking to return, with 24/7 support and personalized concierge service.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-blue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Competitive Pricing</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Transparent pricing with no hidden fees. Get the best value for luxury car rentals without compromising on quality or service.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-blue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted by Thousands</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Join thousands of satisfied customers who have experienced the luxury and reliability of our premium car rental service.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Car Images Grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-4 lg:space-y-6">
                <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden group shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=1000&auto=format&fit=crop&q=80"
                    alt="Luxury Sedan"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=1000&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative h-48 lg:h-60 rounded-2xl overflow-hidden group shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&auto=format&fit=crop&q=80"
                    alt="Luxury SUV"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="space-y-4 lg:space-y-6 pt-8 lg:pt-12">
                <div className="relative h-48 lg:h-60 rounded-2xl overflow-hidden group shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&h=600&auto=format&fit=crop&q=80"
                    alt="Sports Car"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden group shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=1000&auto=format&fit=crop&q=80"
                    alt="Luxury Convertible"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=1000&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
                Our Popular Cars
              </h2>
              <p className="text-lg text-gray-600">
                Discover a selection of the best available luxury vehicles
              </p>
            </div>
            <Link to="/cars">
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 px-6 py-6 text-base font-semibold"
              >
                View All Cars
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCars.map((car) => (
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
        </div>
      </section>

      {/* CTA Section with Triangle Background */}
      <section className="relative my-20 py-20 md:py-20 overflow-hidden">
        {/* Triangle Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute max-w-7xl mx-auto rounded-3xl inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
          ></div>
        </div>
        
        {/* Content */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              Let's drive with <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">Chedtrik</span> Today
            </h2>
            <p className="text-xl md:text-xl text-blue-100 max-w-2xl mx-auto">
              Start your luxury journey now
            </p>
            <Link to="/cars">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg my-4 px-8 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                Explore Our Fleet
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
