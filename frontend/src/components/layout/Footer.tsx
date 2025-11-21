import { Link } from 'react-router-dom'
import { Car, Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Car className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600  to-blue-500 bg-clip-text text-transparent">
                ChedTri9
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Luxury car rental in Morocco. Discover a wide range of elegant cars
              and enjoy an unforgettable journey.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-400 hover:border-blue-400 transition-all duration-300 hover:scale-110 shadow-sm hover:shadow-lg"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/cars"
                  className="text-gray-600 hover:text-primary transition-colors inline-block hover:translate-x-1 transform duration-300"
                >
                  All Cars
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary transition-colors inline-block hover:translate-x-1 transform duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary transition-colors inline-block hover:translate-x-1 transform duration-300"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary transition-colors inline-block hover:translate-x-1 transform duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Our Services</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                Luxury Car Rental
              </li>
              <li className="text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                Long-term Rental
              </li>
              <li className="text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                Corporate Rental
              </li>
              <li className="text-gray-600 flex items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                Delivery Service
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3 text-gray-600 group">
                <div className="w-10 h-10 rounded-full bg-gradient-blue flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="font-medium">+212 6XX XXX XXX</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600 group">
                <div className="w-10 h-10 rounded-full bg-gradient-blue flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="font-medium">info@chedtri9.ma</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ChedTri9</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
