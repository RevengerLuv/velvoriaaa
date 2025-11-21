// Reviews.jsx
import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const Reviews = () => {
  const { axios } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/reviews");
      if (data.success) {
        setReviews(data.reviews);
      } else {
        // Fallback mock data
        setReviews(generateMockReviews());
      }
    } catch (error) {
      console.error("Reviews error:", error);
      toast.error("Error loading reviews");
      setReviews(generateMockReviews());
    } finally {
      setLoading(false);
    }
  };

  const generateMockReviews = () => [
    {
      _id: "1",
      user: { name: "Sarah Johnson", email: "sarah@email.com" },
      product: { name: "Amigurumi Bunny", _id: "p1" },
      rating: 5,
      comment: "Absolutely love this bunny! The craftsmanship is amazing and it arrived so quickly. Will definitely order again!",
      createdAt: "2024-01-15T10:30:00Z",
      status: "approved",
      helpful: 12,
      reply: null
    },
    {
      _id: "2",
      user: { name: "Mike Chen", email: "mike@email.com" },
      product: { name: "Velvoria Blanket", _id: "p2" },
      rating: 4,
      comment: "Beautiful blanket, very warm and cozy. The colors are exactly as shown. Took a bit longer to arrive than expected.",
      createdAt: "2024-01-14T15:20:00Z",
      status: "pending",
      helpful: 8,
      reply: null
    },
    {
      _id: "3",
      user: { name: "Emma Davis", email: "emma@email.com" },
      product: { name: "Baby Booties", _id: "p3" },
      rating: 3,
      comment: "Cute design but the sizing was a bit off. They were smaller than I expected for a 6-month size.",
      createdAt: "2024-01-13T09:15:00Z",
      status: "approved",
      helpful: 5,
      reply: {
        text: "Thank you for your feedback! We've noted the sizing issue and will update our size chart. Please contact us for an exchange.",
        repliedAt: "2024-01-13T14:30:00Z"
      }
    }
  ];

  const updateReviewStatus = async (reviewId, status) => {
    try {
      const { data } = await axios.put(`/api/admin/reviews/${reviewId}`, { status });
      if (data.success) {
        toast.success(`Review ${status}`);
        setReviews(prev => prev.map(review => 
          review._id === reviewId ? { ...review, status } : review
        ));
      }
    } catch (error) {
      console.error("Update review error:", error);
      toast.error("Error updating review");
    }
  };

  const submitReply = async (reviewId) => {
    if (!replyText.trim()) return;

    try {
      const { data } = await axios.post(`/api/admin/reviews/${reviewId}/reply`, {
        reply: replyText
      });
      
      if (data.success) {
        toast.success("Reply submitted");
        setReviews(prev => prev.map(review => 
          review._id === reviewId ? { 
            ...review, 
            reply: {
              text: replyText,
              repliedAt: new Date().toISOString()
            }
          } : review
        ));
        setSelectedReview(null);
        setReplyText("");
      }
    } catch (error) {
      console.error("Reply error:", error);
      toast.error("Error submitting reply");
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === "all") return true;
    return review.status === filter;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === "pending").length,
    approved: reviews.filter(r => r.status === "approved").length,
    average: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
          <p className="text-gray-600 mt-1">Manage and respond to customer feedback</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Reviews</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center border-l-4 border-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.average}</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Reviews</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
          <button
            onClick={fetchReviews}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <div key={review._id} className="p-6 hover:bg-gray-50 transition duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-800">{review.user.name}</h3>
                          <span className="text-sm text-gray-500">{review.user.email}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            review.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {review.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-500">{renderStars(review.rating)}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mt-3">{review.comment}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-gray-500">
                        {review.helpful} people found this helpful
                      </span>
                    </div>

                    {review.reply && (
                      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-purple-800">Store Response</span>
                          <span className="text-sm text-purple-600">
                            {new Date(review.reply.repliedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-purple-700">{review.reply.text}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {review.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateReviewStatus(review._id, "approved")}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateReviewStatus(review._id, "rejected")}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {!review.reply && (
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300 text-sm"
                      >
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredReviews.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-gray-500">No reviews found</p>
            <p className="text-sm text-gray-400 mt-1">Customer reviews will appear here</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Reply to {selectedReview.user.name}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Original Review:</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedReview.comment}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Response
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => submitReply(selectedReview._id)}
                disabled={!replyText.trim()}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
              >
                Submit Reply
              </button>
              <button
                onClick={() => {
                  setSelectedReview(null);
                  setReplyText("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;