import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, MapPin, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Clock,
      title: "Quick Delivery",
      description: "Get your food delivered within 15 minutes across campus",
    },
    {
      icon: MapPin,
      title: "All Departments",
      description: "We deliver to every building and department on campus",
    },
    {
      icon: Star,
      title: "Quality Food",
      description: "Fresh snacks and beverages for your study sessions",
    },
  ];

  const products = [
    { emoji: "🥤", name: "Water Bottle", available: true },
    { emoji: "🍿", name: "Snacks", available: true },
    { emoji: "☕", name: "Coming Soon", available: false },
    { emoji: "🥪", name: "Coming Soon", available: false },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600 animate-pulse">Loading UniEats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="pt-16 pb-12 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div
            className={`max-w-3xl mx-auto text-center transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-6 animate-bounce-slow">
              🎓 University Food Ordering
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Fresh Snacks & Drinks
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent block mt-2">
                Delivered to You
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto px-4">
              Order your favorite snacks and beverages from UniEats. Fast delivery to any department building on campus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link to="/shop" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                >
                  Order Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/reviews" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  See Reviews
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
        <div className="container mx-auto">
          <div
            className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl p-4 sm:p-6 shadow-lg text-center transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    } ${!product.available ? "opacity-60" : ""}`}
                    style={{ transitionDelay: `${index * 100 + 500}ms` }}
                  >
                    <span className="text-3xl sm:text-4xl md:text-5xl mb-2 block animate-bounce-subtle">
                      {product.emoji}
                    </span>
                    <p className="font-medium text-xs sm:text-sm text-slate-700">
                      {product.name}
                    </p>
                    {product.available && (
                      <div className="mt-2 w-2 h-2 bg-green-500 rounded-full mx-auto animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="container mx-auto">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            Why Choose <span className="text-teal-600">UniEats</span>?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150 + 700}ms` }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-teal-100 flex items-center justify-center mb-4 sm:mb-6 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-teal-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div
            className={`bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-8 sm:p-10 md:p-12 text-center max-w-4xl mx-auto shadow-2xl transition-all duration-1000 transform hover:scale-[1.02] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Ready to Order?
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto px-4">
              Browse our selection of snacks and beverages. Quick delivery to your department building.
            </p>
            <Link to="/shop">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-slate-50 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200 bg-white">
        <div className="container mx-auto text-center">
          <p className="text-sm sm:text-base text-slate-600">
            © 2026 UniEats. Made for university students with ❤️
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;