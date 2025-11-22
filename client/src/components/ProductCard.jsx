import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product, index }) => {
  const { addToCart, removeFromCart, cartItems, navigate } = useAppContext();
  
  if (!product) return null;

  return (
    <div
      onClick={() => {
        navigate(`/product/${product.category?.toLowerCase()}/${product._id}`);
        window.scrollTo(0, 0);
      }}
      className="group bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        const BASE_URL = import.meta.env.VITE_BACKEND_URL;

<img
  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
  src={`${BASE_URL}/images/${product.image[0]}`}
  alt={product.name}
/>

        
        {/* Badges */}
        <div className="absolute top-3 left-3 space-y-1">
          {product.madeToOrder && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              Made to Order
            </span>
          )}
          {product.isCustomizable && (
            <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
              Customizable
            </span>
          )}
        </div>

        {/* Quick Add Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {!cartItems?.[product._id] ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product._id);
              }}
              className="bg-white text-purple-600 p-2 rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition-colors"
            >
              <span className="text-lg">+</span>
            </button>
          ) : null}
        </div>

        {/* Category Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        {/* Name and Rating */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1 mt-1">
            {Array(5).fill("").map((_, i) => (
              <span
                key={i}
                className={`text-sm ${i < Math.floor(product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.rating || 4})</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {Array.isArray(product.description) 
            ? product.description[0] 
            : product.description
          }
        </p>

        {/* Materials */}
        {product.materials && product.materials.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.materials.slice(0, 2).map((material, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs"
              >
                {material}
              </span>
            ))}
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-purple-600">
              ₹{product.offerPrice || product.price}
            </p>
            {product.offerPrice && product.offerPrice < product.price && (
              <p className="text-gray-400 text-sm line-through">
                ${product.price}
              </p>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {!cartItems?.[product._id] ? (
              <button
                onClick={() => addToCart(product._id)}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <span>+</span>
                <span>Add</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3 bg-purple-100 text-purple-600 px-3 py-2 rounded-xl font-semibold">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-purple-200 transition-colors"
                >
                  -
                </button>
                <span className="min-w-6 text-center">{cartItems[product._id]}</span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-purple-200 transition-colors"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
