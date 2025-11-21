// Products.jsx - Updated for crochet products
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.materials?.some(material => 
            material.toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);
  
  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
          Handmade Velvoria Collection
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Discover unique, handmade velvoria creations crafted with love and attention to detail. 
          Each piece tells a story of creativity and craftsmanship.
        </p>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts
            .filter((product) => product.inStock)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No velvoria creations found
          </h2>
          <p className="text-gray-600">
            {searchQuery ? `No results for "${searchQuery}". Try a different search term.` : 'No products available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;