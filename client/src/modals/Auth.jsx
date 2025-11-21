import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { GoogleLogin } from '@react-oauth/google';

const Auth = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setShowUserLogin, setUser, axios, navigate, backendConnected, googleLogin } = useAppContext();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      
      if (!backendConnected) {
        toast.error("Backend server is not running. Please start the server to login.");
        return;
      }
      
      setLoading(true);
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });
      
      if (data.success) {
        toast.success(data.message);
        navigate("/");
        setUser(data.user);
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        toast.error('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/user/google-auth", {
        token: credentialResponse.credential
      });
      
      if (data.success) {
        toast.success("Google login successful!");
        setUser(data.user);
        setShowUserLogin(false);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 left-0 bottom-0 right-0 z-50 flex items-center justify-center bg-black/50 text-gray-600"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[400px] rounded-2xl shadow-2xl border border-gray-200 bg-white"
      >
        {/* Header */}
        <div className="text-center w-full mb-2">
          <p className="text-3xl font-bold text-gray-900">
            <span className="text-purple-600">Velvoria</span> Store
          </p>
          <p className="text-gray-600 mt-2">
            {state === "login" ? "Welcome back to your velvoria paradise" : "Join our creative community"}
          </p>
        </div>
        
        {/* Google Sign In */}
        <div className="w-full mb-4">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login failed")}
            theme="filled_blue"
            size="large"
            text={state === "login" ? "signin_with" : "signup_with"}
            shape="rectangular"
            width="100%"
          />
        </div>

        <div className="flex items-center w-full my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Existing Form */}
        {state === "register" && (
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Enter your full name"
              className="border border-gray-300 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              type="text"
              required
              disabled={loading}
            />
          </div>
        )}
        
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Enter your email"
            className="border border-gray-300 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            type="email"
            required
            disabled={loading}
          />
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Enter your password"
            className="border border-gray-300 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            type="password"
            required
            disabled={loading}
          />
        </div>
        
        {state === "register" ? (
          <p className="text-sm text-gray-600 w-full text-center">
            Already have account?{" "}
            <span
              onClick={() => !loading && setState("login")}
              className="text-purple-600 cursor-pointer font-medium hover:text-purple-700 transition duration-300"
            >
              Sign In
            </span>
          </p>
        ) : (
          <p className="text-sm text-gray-600 w-full text-center">
            Don't have an account?{" "}
            <span
              onClick={() => !loading && setState("register")}
              className="text-purple-600 cursor-pointer font-medium hover:text-purple-700 transition duration-300"
            >
              Create Account
            </span>
          </p>
        )}
        
        <button 
          className={`bg-purple-600 hover:bg-purple-700 transition-all text-white w-full py-3 rounded-xl font-medium cursor-pointer mt-2 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Please wait...
            </div>
          ) : (
            state === "register" ? "Create Account" : "Sign In"
          )}
        </button>

        {/* Security Note */}
        <p className="text-xs text-gray-500 text-center w-full mt-4">
          🔒 Your data is securely encrypted and protected
        </p>
      </form>
    </div>
  );
};

export default Auth;