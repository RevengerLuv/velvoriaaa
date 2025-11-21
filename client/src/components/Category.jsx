import { useAppContext } from "../context/AppContext";

const Category = () => {
  const { navigate } = useAppContext();
  
  const crochetCategories = [
    {
      id: 'amigurumi',
      name: 'Amigurumi',
      icon: '🐰',
      description: 'Cute stuffed toys',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'wearables',
      name: 'Wearables',
      icon: '🧣',
      description: 'Cozy clothing',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'home-decor',
      name: 'Home Decor',
      icon: '🏠',
      description: 'Home essentials',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: '👜',
      description: 'Style accessories',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'seasonal',
      name: 'Seasonal',
      icon: '🎄',
      description: 'Seasonal specials',
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'custom',
      name: 'Custom',
      icon: '🎨',
      description: 'Made to order',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Shop by <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our carefully crafted categories to find the perfect handmade creation for every occasion
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {crochetCategories.map((category) => (
            <div
              key={category.id}
              onClick={() => {
                navigate(`/products/₹{category.id}`);
                window.scrollTo(0, 0);
              }}
              className={`
                group relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300
                hover:transform hover:-translate-y-2 hover:shadow-2xl border border-gray-100
                ₹{category.bgColor} hover:bg-gradient-to-br ${category.color} hover:text-white
              `}
            >
              <div className="text-center space-y-4">
                {/* Icon */}
                <div className={`
                  w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl
                  group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300
                  bg-white shadow-lg
                `}>
                  {category.icon}
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg group-hover:text-white text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-white/90">
                    {category.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-lg">→</span>
                </div>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
          <button
            onClick={() => navigate("/custom-order")}
            className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            <span>Request Custom Order</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Category;