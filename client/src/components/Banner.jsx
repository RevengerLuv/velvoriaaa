import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  return (
    <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
      {/* Simple background pattern using Tailwind */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-purple-50/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Handmade with{" "}
                <span className="text-purple-600">Love</span>
                , Crafted with{" "}
                <span className="text-pink-600">Care</span>
                !
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 max-w-2xl">
                Discover unique velvoria creations that bring warmth and charm to your life
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/products"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <span>Explore Collection</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/custom-order"
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
              >
                Custom Orders
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 max-w-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-gray-600 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">1K+</div>
                <div className="text-gray-600 text-sm">Creations Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.9★</div>
                <div className="text-gray-600 text-sm">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <img
                src={assets.main_banner_bg}
                alt="Handmade Velvoria Collection"
                className="w-full h-80 lg:h-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-white"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-white"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  );
};

export default Banner;