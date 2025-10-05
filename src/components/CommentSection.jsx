"use client";

import { useState, useEffect, useCallback } from "react";
import FeedbackManager from "../utils/FeedbackManager";

const CommentSection = ({ questionId, userId, username, onCommentPosted }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [reportingCommentId, setReportingCommentId] = useState(null);
  const [reportReason, setReportReason] = useState("");

  const loadComments = useCallback(() => {
    try {
      const loadedComments = FeedbackManager.getCommentsSorted(questionId, sortBy);
      // Filter out removed comments
      const visibleComments = loadedComments.filter(c => !c.removed);
      setComments(visibleComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    }
  }, [questionId, sortBy]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    try {
      FeedbackManager.addComment(
        questionId, 
        newComment.trim(),
        userId || "anonymous", 
        username || "Anonymous User"
      );
      setNewComment("");
      loadComments();
      
      // Trigger thank you modal
      if (onCommentPosted) {
        setTimeout(() => {
          onCommentPosted();
        }, 500);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = (commentId) => {
    try {
      FeedbackManager.likeComment(questionId, commentId, userId || "anonymous");
      loadComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDelete = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        FeedbackManager.deleteComment(questionId, commentId, userId || "anonymous");
        loadComments();
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  const handleReportComment = (commentId) => {
    setReportingCommentId(commentId);
  };

  const submitReport = () => {
    if (!reportReason.trim()) {
      alert("Please select a reason for reporting");
      return;
    }

    try {
      FeedbackManager.reportComment(questionId, reportingCommentId, reportReason, userId || "anonymous");
      alert("Comment reported successfully. Our team will review it.");
      setReportingCommentId(null);
      setReportReason("");
      loadComments();
    } catch (error) {
      console.error("Error reporting comment:", error);
      alert("Failed to report comment. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-gray-800">Comments ({comments.length})</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="recent">Most Recent</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>

      <form onSubmit={handleSubmitComment} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          maxLength={500}
          placeholder="Share your thoughts..."
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={2}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{newComment.length}/500</span>
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white px-4 py-1 rounded-lg text-sm font-medium transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className={`bg-white rounded-lg p-3 shadow-sm ${comment.flagged ? 'border-2 border-orange-300' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{comment.username}</span>
                  {comment.flagged && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                      Flagged
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(comment.timestamp).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2">
                {comment.userId === userId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Delete
                  </button>
                )}
                {comment.userId !== userId && (
                  <button
                    onClick={() => handleReportComment(comment.id)}
                    className="text-gray-500 hover:text-red-600 text-xs flex items-center gap-1"
                    title="Report inappropriate comment"
                  >
                    🚩 Report
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-2">{comment.text}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLike(comment.id)}
                className={`text-xs ${
                  comment.likedBy?.includes(userId)
                    ? "text-purple-600 font-medium"
                    : "text-gray-500"
                } hover:text-purple-700 flex items-center gap-1`}
              >
                👍 {comment.likes > 0 && comment.likes}
              </button>
              {comment.reportCount > 0 && (
                <span className="text-xs text-gray-500">
                  {comment.reportCount} report{comment.reportCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>

      {/* Report Modal */}
      {reportingCommentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Comment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Why are you reporting this comment?
            </p>
            <div className="space-y-2 mb-4">
              {[
                { value: 'spam', label: 'Spam or misleading' },
                { value: 'harassment', label: 'Harassment or hate speech' },
                { value: 'inappropriate', label: 'Inappropriate content' },
                { value: 'offensive', label: 'Offensive language' },
                { value: 'other', label: 'Other' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reportReason"
                    value={option.value}
                    checked={reportReason === option.value}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="text-purple-600"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setReportingCommentId(null);
                  setReportReason("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submitReport}
                disabled={!reportReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-gray-300"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;