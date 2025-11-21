import { useState } from 'react';
import { Link } from 'react-router-dom';

const CustomOrders = () => {
  const [activeTab, setActiveTab] = useState('process');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Custom Orders
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let's create something extraordinary together! Start your custom creation journey by reaching out to us on Instagram.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12">
          <div className="p-8 md:p-12">
            {/* Contact Card */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Let's Start Your Custom Creation!
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                DM us on Instagram with your idea, and we'll guide you through the entire process. We're excited to hear about your vision!
              </p>

              {/* Instagram Contact Button */}
              <a
                href="https://instagram.com/your-instagram-handle"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Message Us on Instagram
              </a>

              <p className="text-sm text-gray-500 mt-4">
                @your-instagram-handle
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-12"></div>

            {/* Tabs Navigation */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1">
                <button
                  onClick={() => setActiveTab('process')}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'process'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  How It Works
                </button>
                <button
                  onClick={() => setActiveTab('examples')}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'examples'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Examples
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'faq'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  FAQ
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-3xl mx-auto">
              {activeTab === 'process' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    Our Custom Order Process
                  </h3>
                  
                  <div className="grid md:grid-cols-4 gap-6">
                    {[
                      {
                        step: 1,
                        title: "Reach Out",
                        description: "DM us on Instagram with your idea",
                        icon: "💬"
                      },
                      {
                        step: 2,
                        title: "Consultation",
                        description: "We discuss details & requirements",
                        icon: "🎨"
                      },
                      {
                        step: 3,
                        title: "Quote & Timeline",
                        description: "We provide pricing and delivery date",
                        icon: "💰"
                      },
                      {
                        step: 4,
                        title: "Creation & Delivery",
                        description: "We create and ship your masterpiece",
                        icon: "🚚"
                      }
                    ].map((item) => (
                      <div key={item.step} className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                          {item.icon}
                        </div>
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                          {item.step}
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'examples' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    What We Can Create
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      "Custom clothing & apparel",
                      "Personalized home decor",
                      "Handmade jewelry pieces",
                      "Custom artwork & paintings",
                      "Special occasion gifts",
                      "Branded merchandise",
                      "Unique accessories",
                      "Themed collections"
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                    Frequently Asked Questions
                  </h3>
                  {[
                    {
                      question: "How long does a custom order take?",
                      answer: "Typically 2-6 weeks depending on complexity and current workload. We'll provide a timeline during consultation."
                    },
                    {
                      question: "What information should I include in my DM?",
                      answer: "Please include: your idea, preferred materials, colors, dimensions (if applicable), budget range, and deadline requirements."
                    },
                    {
                      question: "Do you require a deposit?",
                      answer: "Yes, we require a 50% deposit to start custom orders, with the balance due before shipping."
                    },
                    {
                      question: "Can I see progress photos?",
                      answer: "Absolutely! We provide regular updates and progress photos throughout the creation process."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Can't use Instagram? Email us at:
          </p>
          <a 
            href="mailto:your-email@velvoria.com" 
            className="text-purple-600 hover:text-purple-700 font-semibold text-lg"
          >
            your-email@velvoria.com
          </a>
        </div>

        {/* Back to Shopping */}
        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomOrders;