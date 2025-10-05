import { useState, useEffect } from "react";
import FeedbackManager from "../utils/FeedbackManager";

const UserFeedbackHistory = ({ onEditRating, onDeleteComment }) => {
  const [history, setHistory] = useState({ ratings: [], reports: [], comments: [] });
  const [activeTab, setActiveTab] = useState("ratings");
  const [editingRating, setEditingRating] = useState(null);
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const userHistory = FeedbackManager.getUserFeedbackHistory();
    setHistory(userHistory);
  };

  const handleUpdateRating = (questionId, currentRating) => {
    setEditingRating(questionId);
    setNewRating(currentRating);
  };

  const submitRatingUpdate = (questionId, userId = 'anonymous') => {
    if (newRating > 0) {
      FeedbackManager.addRating(questionId, userId, newRating);
      setEditingRating(null);
      loadHistory();
      if (onEditRating) onEditRating(questionId, newRating);
    }
  };

  const handleDeleteComment = (questionId, commentId, userId = 'anonymous') => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      const success = FeedbackManager.deleteComment(questionId, commentId, userId);
      if (success) {
        loadHistory();
        if (onDeleteComment) onDeleteComment(commentId);
      }
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating, isEditing) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => isEditing && setNewRating(star)}
            disabled={!isEditing}
            className={`text-2xl transition-all ${
              star <= (isEditing ? newRating : rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            } ${isEditing ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Feedback History</h2>
        <p className="text-gray-600">View and manage your ratings, reports, and comments</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{history.ratings.length}</div>
          <div className="text-sm text-purple-700">Questions Rated</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">{history.reports.length}</div>
          <div className="text-sm text-orange-700">Reports Filed</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{history.comments.length}</div>
          <div className="text-sm text-blue-700">Comments Posted</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("ratings")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "ratings"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          My Ratings ({history.ratings.length})
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "reports"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          My Reports ({history.reports.length})
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "comments"
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          My Comments ({history.comments.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "ratings" && (
          <>
            {history.ratings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-4">⭐</p>
                <p className="text-lg">You haven't rated any questions yet</p>
                <p className="text-sm mt-2">Rate questions to help improve the quiz quality</p>
              </div>
            ) : (
              history.ratings.map((rating, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Question ID:</strong> {rating.questionId}
                      </p>
                      {editingRating === rating.questionId ? (
                        <div className="space-y-2">
                          {renderStars(rating.rating, true)}
                          <div className="flex gap-2">
                            <button
                              onClick={() => submitRatingUpdate(rating.questionId)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingRating(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {renderStars(rating.rating, false)}
                          <span className="text-sm text-gray-600">({rating.rating}/5)</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDate(rating.timestamp)}
                      </p>
                      {editingRating !== rating.questionId && (
                        <button
                          onClick={() => handleUpdateRating(rating.questionId, rating.rating)}
                          className="text-sm text-purple-600 hover:text-purple-700"
                        >
                          Edit Rating
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "reports" && (
          <>
            {history.reports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-4">🚩</p>
                <p className="text-lg">You haven't reported any questions</p>
                <p className="text-sm mt-2">Report questions that need attention</p>
              </div>
            ) : (
              history.reports.map((report, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                          {report.reason}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Question ID:</strong> {report.questionId}
                      </p>
                      {report.additionalComments && (
                        <p className="text-sm text-gray-700 bg-white rounded p-2 mb-2">
                          {report.additionalComments}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(report.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === "comments" && (
          <>
            {history.comments.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-4">💬</p>
                <p className="text-lg">You haven't posted any comments</p>
                <p className="text-sm mt-2">Share your thoughts and help other learners</p>
              </div>
            ) : (
              history.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-600">
                      <strong>Question ID:</strong> {comment.questionId}
                    </p>
                    <div className="flex gap-2">
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.timestamp)}
                      </p>
                      <button
                        onClick={() => handleDeleteComment(comment.questionId, comment.commentId)}
                        className="text-xs text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 bg-white rounded p-3">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserFeedbackHistory;