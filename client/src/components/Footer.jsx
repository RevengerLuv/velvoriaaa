const Footer = () => {
  return (
    <div className="text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
      <div className="flex flex-wrap justify-between gap-12 md:gap-6">
        <div className="max-w-80">
          <h1 className="text-3xl font-semibold text-pink-600">VelvoriaCraft</h1>
          <p className="text-sm mt-2">
            Handmade Fiber Art creations crafted with love and attention to detail. 
            Each piece tells a story and brings warmth to your life.
          </p>
          <div className="flex items-center gap-3 mt-4">
            {/* Social icons - keep existing but update colors to pink */}
          </div>
        </div>

        <div>
          <p className="text-lg text-gray-800 font-semibold">SHOP</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><a href="/products/amigurumi" className="hover:text-pink-600">Amigurumi</a></li>
            <li><a href="/products/wearables" className="hover:text-pink-600">Wearables</a></li>
            <li><a href="/products/home-decor" className="hover:text-pink-600">Home Decor</a></li>
            <li><a href="/products/accessories" className="hover:text-pink-600">Accessories</a></li>
            <li><a href="/custom-order" className="hover:text-pink-600">Custom Orders</a></li>
          </ul>
        </div>

        <div>
          <p className="text-lg text-gray-800 font-semibold">SUPPORT</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><a href="#" className="hover:text-pink-600">Care Instructions</a></li>
            <li><a href="#" className="hover:text-pink-600">Shipping Info</a></li>
            <li><a href="#" className="hover:text-pink-600">Returns & Exchanges</a></li>
            <li><a href="#" className="hover:text-pink-600">Contact Us</a></li>
            <li><a href="#" className="hover:text-pink-600">FAQ</a></li>
          </ul>
        </div>

        <div className="max-w-80">
          <p className="text-lg text-gray-800 font-semibold">STAY INSPIRED</p>
          <p className="mt-3 text-sm">
            Get updates on new collections, Fiber Art tips, and exclusive offers.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="text"
              className="bg-white rounded-l border border-gray-300 h-9 px-3 outline-none focus:border-pink-400 flex-1"
              placeholder="Your email"
            />
            <button className="flex items-center justify-center bg-pink-500 hover:bg-pink-600 h-9 w-9 aspect-square rounded-r transition-colors">
              <svg
                className="w-4 h-4 text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <hr className="border-gray-300 mt-8" />
      <div className="flex flex-col md:flex-row gap-2 items-center justify-between py-5">
        <p>© {new Date().getFullYear()} Velvoria. All rights reserved.</p>
        <ul className="flex items-center gap-4">
          <li><a href="#" className="hover:text-pink-600">Privacy</a></li>
          <li><a href="#" className="hover:text-pink-600">Terms</a></li>
          <li><a href="#" className="hover:text-pink-600">Sitemap</a></li>
        </ul>
      </div>
    </div>
  );
};
export default Footer;