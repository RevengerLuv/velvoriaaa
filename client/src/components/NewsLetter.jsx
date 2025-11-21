import { useState } from "react";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("🎉 Welcome to our creative community!");
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0 bg-white/10"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Join Our Creative Community!
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Get inspired with Velvoria tips, new collection launches, and exclusive offers 
              delivered straight to your inbox.
            </p>
          </div>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-4 rounded-2xl border-0 focus:ring-4 focus:ring-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 text-lg"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Subscribing...</span>
                  </div>
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </div>
          </form>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
            {[
              { icon: "🎁", text: "Exclusive Offers" },
              { icon: "💡", text: "Velvoria Tips" },
              { icon: "🆕", text: "New Collections" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 text-purple-100">
                <span className="text-2xl">{benefit.icon}</span>
                <span className="font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Badge */}
          <div className="pt-8 border-t border-purple-400/30">
            <p className="text-purple-200 text-sm">
              Join 5,000+ creative souls. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-bounce"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/5 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
    </section>
  );
};

export default NewsLetter;