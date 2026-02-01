import { useState, useEffect } from "react";
import { Star, Send, User, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1466884005986046104/quAp-F2AwZzVh1Fbyt1kmzUpPgOg4WGK54UUqhRFkKzetkZCihkzXH_Q52QwilJBHUWK";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  timestamp: string;
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Load reviews from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedReviews = localStorage.getItem("campusReviews");
      if (savedReviews) {
        setReviews(JSON.parse(savedReviews));
      }
      setIsLoading(false);
      setIsVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem("campusReviews", JSON.stringify(reviews));
    }
  }, [reviews]);

  const sendToDiscord = async (review: Review) => {
    try {
      const stars = "⭐".repeat(review.rating);
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: "📝 **New Review Submitted!**",
          embeds: [
            {
              title: `Review from ${review.name}`,
              description: review.comment,
              color: 0x14b8a6,
              fields: [
                {
                  name: "Rating",
                  value: `${stars} (${review.rating}/5)`,
                  inline: true,
                },
                {
                  name: "Time",
                  value: new Date(review.timestamp).toLocaleString(),
                  inline: true,
                },
              ],
              timestamp: review.timestamp,
              footer: {
                text: "Campus Food Delivery Reviews",
              },
            },
          ],
        }),
      });
    } catch (error) {
      console.error("Error sending to Discord:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmitting(true);

    const newReview: Review = {
      id: Date.now().toString(),
      name: name.trim(),
      rating,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add review to list (real-time update)
    setReviews((prev) => [newReview, ...prev]);

    // Send to Discord
    await sendToDiscord(newReview);

    // Clear form
    setName("");
    setRating(0);
    setComment("");
    setIsSubmitting(false);

    toast.success("Thank you for your review! 🎉");
  };

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-slate-600 animate-pulse">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-6 sm:mb-8 transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-6 sm:mt-10 mb-3 sm:mb-6 px-4">
            Customer <span className="text-teal-600">Reviews</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 px-4">
            Share your experience with us
          </p>
        </div>

        {/* Stats */}
        <Card
          className={`p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-teal-600 animate-pulse">
                {averageRating}
              </div>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                      star <= Math.round(parseFloat(averageRating))
                        ? "fill-yellow-400 text-yellow-400 animate-bounce-subtle"
                        : "text-gray-300"
                    }`}
                    style={{ animationDelay: `${star * 100}ms` }}
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Average Rating</p>
            </div>
            <div className="hidden sm:block h-16 w-px bg-slate-200"></div>
            <div className="sm:hidden w-16 h-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-teal-600 animate-pulse">
                {reviews.length}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Total Reviews</p>
            </div>
          </div>
        </Card>

        {/* Review Form */}
        <Card
          className={`p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-500 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
            Write a Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:scale-[1.02]"
              />
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all duration-300 hover:scale-125 active:scale-95 touch-manipulation"
                  >
                    <Star
                      className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                placeholder="Tell us about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:scale-[1.02] resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-5 sm:py-6 text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </div>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                  Submit Review
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Reviews List */}
        <div
          className={`space-y-4 transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <h2 className="text-xl sm:text-2xl font-bold px-2">Recent Reviews</h2>
          {reviews.length === 0 ? (
            <Card className="p-6 sm:p-8 text-center text-slate-400 shadow-lg">
              <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                No reviews yet. Be the first to share your experience!
              </p>
            </Card>
          ) : (
            reviews.map((review, index) => (
              <Card
                key={review.id}
                className={`p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse-slow">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1 sm:gap-0">
                      <h3 className="font-bold text-base sm:text-lg truncate">{review.name}</h3>
                      <span className="text-xs sm:text-sm text-slate-500">
                        {new Date(review.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-all ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-xs sm:text-sm text-slate-600 ml-1 sm:ml-2">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 break-words">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>


    </div>
  );
};

export default Reviews;