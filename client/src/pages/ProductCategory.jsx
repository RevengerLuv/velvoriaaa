// ProductCategory.jsx - Updated for crochet categories
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );
  
  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-center w-full mb-8">
          <div className="w-20 h-1 bg-purple-500 rounded-full mb-4"></div>
          <h1 className="text-3xl md:text-4xl font-medium text-gray-800 text-center">
            {searchCategory.text}
          </h1>
          <p className="text-gray-600 mt-2 text-center max-w-2xl">
            Discover our beautiful handmade {searchCategory.text.toLowerCase()} collection, 
            each piece crafted with love and attention to detail.
          </p>
        </div>
      )}     
      {filteredProducts.length > 0 ? (
        <div>
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-center justify-center">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🧶</span>
          </div>
          <h1 className="text-2xl font-medium text-gray-800 mb-2">
            No {searchCategory?.text.toLowerCase()} found
          </h1>
          <p className="text-gray-600">
            We're constantly adding new handmade creations. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;