// SingleProduct.jsx - Updated for crochet products
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const SingleProduct = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const product = products.find((product) => product._id === id);
  
  useEffect(() => {
    if (products.length > 0 && product) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => item.category === product.category && item._id !== product._id
      );
      setRelatedProducts(productsCopy.slice(0, 4));
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
  }, [product]);

  return (
    product && (
      <div className="mt-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600 transition duration-300">Home</Link>
          <span className="mx-2">/</span>
          <Link to={"/products"} className="hover:text-purple-600 transition duration-300">All Creations</Link>
          <span className="mx-2">/</span>
          <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-purple-600 transition duration-300">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-purple-600 font-medium">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Images */}
          <div className="flex flex-col-reverse lg:flex-row gap-6 lg:w-1/2">
            <div className="flex lg:flex-col gap-3 order-2 lg:order-1">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition duration-300 hover:border-purple-500 ${
                    thumbnail === image ? 'border-purple-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={`${BASE_URL}/images/${product.image[0]}`}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-20 h-20 lg:w-24 lg:h-24 object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden order-1 lg:order-2 flex-1">
              const BASE_URL = import.meta.env.VITE_BACKEND_URL;

<img
  src={`${BASE_URL}/images/${thumbnail}`}
  alt={product.name}
  className="w-full h-96 object-cover"
/>

            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-1 mb-6">
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    src={i < Math.floor(product.rating || 4) ? assets.star_icon : assets.star_dull_icon}
                    alt="star"
                    key={i}
                    className="w-5 h-5"
                  />
                ))}
              <p className="text-gray-600 ml-2">({product.rating || 4})</p>
              <span className="mx-2 text-gray-300">•</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                Handmade
              </span>
            </div>

            <div className="mb-6">
<p className="text-3xl font-bold text-purple-600 mb-2">
  ₹{product.offerPrice}
</p>
              <p className="text-3xl font-bold text-purple-600 mb-2">
                ₹{product.offerPrice}
              </p>
              <span className="text-gray-500 text-sm">(inclusive of all taxes)</span>
            </div>

            {/* Crochet Specifications */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Product Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <p><strong className="text-gray-700">Materials:</strong> {product.materials?.join(', ') || 'Cotton Yarn'}</p>
                  <p><strong className="text-gray-700">Care Instructions:</strong> {product.careInstructions || 'Hand wash cold, lay flat to dry'}</p>
                </div>
                <div>
                  <p><strong className="text-gray-700">Skill Level:</strong> {product.skillLevel || 'Intermediate'}</p>
                  <p><strong className="text-gray-700">Made With:</strong> Love & Care</p>
                </div>
              </div>
            </div>

            <p className="text-lg font-semibold text-gray-800 mb-3">About This Creation</p>
            <ul className="list-disc ml-5 text-gray-600 space-y-1 mb-8">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            {/* Pattern Information */}
            {product.patternAvailable && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">Pattern Available</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Love this design? Get the digital pattern to make it yourself!
                </p>
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition duration-300">
  Buy Pattern - ₹{product.patternPrice}
</button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => addToCart(product._id)}
                className="flex-1 py-4 font-semibold bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition duration-300 rounded-lg flex items-center justify-center gap-2"
              >
                <span>🧶</span>
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id);
                  navigate("/cart");
                  scrollTo(0, 0);
                }}
                className="flex-1 py-4 font-semibold bg-purple-500 text-white hover:bg-purple-600 transition duration-300 rounded-lg flex items-center justify-center gap-2"
              >
                <span>⚡</span>
                Buy Now
              </button>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <span>🚚</span>
                <p className="text-sm font-medium">Free shipping on all orders</p>
              </div>
              <p className="text-green-700 text-xs mt-1">
                Typically ships in 3-5 business days
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-1 bg-purple-500 rounded-full mb-4"></div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 text-center">
                You Might Also Love
              </h2>
              <p className="text-gray-600 mt-2 text-center">
                More beautiful handmade creations in {product.category}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {relatedProducts
                .filter((product) => product.inStock)
                .map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => {
                  navigate("/products");
                  scrollTo(0, 0);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-300"
              >
                Explore All Creations
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default SingleProduct;
