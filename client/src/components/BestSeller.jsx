import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();
  
  const bestSellers = products
    .filter((product) => product.inStock)
    .slice(0, 5);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Best <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Sellers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most loved velvoria creations, handpicked by our community
          </p>
        </div>

        {/* Products Grid */}
        {bestSellers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {bestSellers.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧶</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">We're adding new creations soon!</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-2xl font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;