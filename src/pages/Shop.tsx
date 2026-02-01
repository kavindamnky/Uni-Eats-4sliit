import { useState, useEffect } from "react";
import { Plus, Minus, Trash2, ShoppingBag, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const products = [
  {
    id: "1",
    name: "Water Bottle",
    price: 1.5,
    description: "500ml Fresh Spring Water",
    image: "🥤",
  },
  {
    id: "2",
    name: "Snacks Pack",
    price: 2.5,
    description: "Assorted chips & cookies",
    image: "🍿",
  },
];

const departments = [
  "Engineering Faculty",
  "Main Building",  
  "New Building",
  "Juice Bar",
  "Willium Anglish",
  // "Library",
  // "Student Center",
  // "Medical Faculty",
];

const WHATSAPP_NUMBER = "94721741038"; // Without + or spaces
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1466884005986046104/quAp-F2AwZzVh1Fbyt1kmzUpPgOg4WGK54UUqhRFkKzetkZCihkzXH_Q52QwilJBHUWK";

const Shop = () => {
  const {
    items,
    department,
    addItem,
    updateQuantity,
    removeItem,
    setDepartment,
    clearCart,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleAddItem = (product: typeof products[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  // Calculate total from items in cart
  const calculatedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const sendToDiscord = async (orderDetails: string) => {
    try {
      const response = await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "🛒 **New Order Received!**",
          embeds: [
            {
              title: "Order Details",
              description: orderDetails,
              color: 0x14b8a6, // Teal color
              timestamp: new Date().toISOString(),
              footer: {
                text: "Campus Food Delivery",
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error("Discord webhook failed");
      }
    } catch (error) {
      console.error("Error sending to Discord:", error);
    }
  };

  const handleCheckout = async () => {
    if (!department) {
      toast.error("Please select a delivery location");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);

    // Prepare order details for Discord (with emojis)
    const orderItemsDiscord = items
      .map((item) => `${item.image} ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
      .join("\n");

    const orderSummaryDiscord = `📍 Delivery Location: ${department}\n\n${orderItemsDiscord}\n\n💰 Total: $${calculatedTotal.toFixed(2)}`;

    // Prepare order details for WhatsApp (without emojis for better compatibility)
    const orderItemsWhatsApp = items
      .map((item) => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
      .join("%0A");

    const whatsappMessage = `*NEW ORDER*%0A%0A*Delivery Location:* ${department}%0A%0A${orderItemsWhatsApp}%0A%0A*Total: $${calculatedTotal.toFixed(2)}*`;
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

    // Send to Discord
    await sendToDiscord(orderSummaryDiscord);

    // Open WhatsApp
    window.open(whatsappURL, "_blank");

    // Show success message and clear cart
    setTimeout(() => {
      toast.success("Order sent successfully! 🎉");
      clearCart();
      setIsCheckingOut(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600 animate-pulse">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-6 sm:mb-8 transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6 sm:mt-10 mb-3 sm:mb-6 px-4">
            Our <span className="text-teal-600">Menu</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 px-4">
            Select your items and choose delivery location
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Products Grid */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <h2
              className={`text-xl sm:text-2xl font-bold px-2 transition-all duration-1000 transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              Available Items
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <Card
                  key={product.id}
                  className={`p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                    <div className="text-5xl sm:text-6xl animate-bounce-subtle">{product.image}</div>
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl mb-1">{product.name}</h3>
                      <p className="text-slate-600 text-xs sm:text-sm">
                        {product.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span className="text-xl sm:text-2xl font-bold text-teal-600">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={() => handleAddItem(product)}
                        className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-4 sm:px-6 py-5 sm:py-6 transition-all duration-300 hover:scale-110 hover:shadow-xl group"
                      >
                        <Plus className="w-4 h-4 mr-1 group-hover:rotate-90 transition-transform" />
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* More items coming soon */}
            <Card
              className={`p-4 bg-gradient-to-br from-slate-100 to-slate-50 border-2 border-dashed border-slate-300 transition-all duration-1000 transform hover:scale-[1.02] ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <p className="text-slate-600 text-center text-sm sm:text-base animate-pulse">
                🍕 More items coming soon! Coffee, sandwiches, and more.
              </p>
            </Card>
          </div>

          {/* Cart Sidebar */}
          <div
            className={`lg:sticky lg:top-4 h-fit transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <Card className="p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-bold">Your Cart</h2>
              </div>

              {/* Department Select */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium mb-2">
                  Delivery Location
                </label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="transition-all duration-300 hover:border-teal-500 focus:ring-2 focus:ring-teal-500">
                    <SelectValue placeholder="Select building..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept} className="cursor-pointer hover:bg-teal-50">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cart Items - FIXED OVERFLOW */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-[300px] sm:max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar pr-1">
                {items.length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-slate-400">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50 animate-bounce-subtle" />
                    <p className="text-sm sm:text-base">Your cart is empty</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-br from-slate-50 to-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-2xl sm:text-3xl animate-bounce-subtle flex-shrink-0">{item.image}</div>
                      <div className="flex-1 min-w-0 mr-2">
                        <h4 className="font-medium truncate text-sm sm:text-base">{item.name}</h4>
                        <p className="text-teal-600 font-bold text-sm sm:text-base">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-teal-50 hover:border-teal-600 transition-all duration-300 hover:scale-110 flex-shrink-0"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <span className="w-6 sm:w-8 text-center font-medium text-sm sm:text-base flex-shrink-0">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-teal-50 hover:border-teal-600 transition-all duration-300 hover:scale-110 flex-shrink-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all duration-300 hover:scale-110 flex-shrink-0"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total & Checkout */}
              <div className="border-t pt-3 sm:pt-4 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between text-lg sm:text-xl font-bold">
                  <span>Total</span>
                  <span className="text-teal-600 animate-pulse">${calculatedTotal.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || !department || isCheckingOut}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isCheckingOut ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      Place Order
                    </div>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Shop;