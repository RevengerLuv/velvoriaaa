import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// Remove any BrowserRouter imports and only use HashRouter

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const { showUserLogin, isSeller } = useAppContext();
  
  return (
    <GoogleOAuthProvider clientId="233054564282-9bkk084dbqombdtinrbpdn9utmd1636k.apps.googleusercontent.com">
      <div className="min-h-screen bg-gray-50 font-inter">
        {isSellerPath ? null : <Navbar />}
        {showUserLogin ? <Auth /> : null}
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              borderRadius: '12px',
              border: '1px solid #374151',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <main className={isSellerPath ? "bg-gray-50" : ""}>
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:category" element={<ProductCategory />} />
            <Route path="/product/:category/:id" element={<SingleProduct />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-address" element={<Address />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/custom-orders" element={<CustomOrders />} />
            
            {/* Seller routes */}
            <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />}>
              <Route index element={<Dashboard />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="orders" element={<Orders />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products" element={<ProductList />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="settings" element={<Settings />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="FundUsage" element={<FundUsage />} />
              <Route path="AdsManagement" element={<AdsManagement />} />
            </Route>
          </Routes>
        </main>
        
        {isSellerPath ? null : <Footer />}
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
