import { useState } from "react";
import FeedbackManager from "../utils/FeedbackManager";

const ReportModal = ({ questionId, userId, question, onReportSubmitted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: "incorrect_answer", label: "Incorrect Answer" },
    { value: "typo_grammar", label: "Typo/Grammar Issue" },
    { value: "unclear_question", label: "Unclear Question" },
    { value: "duplicate", label: "Duplicate Question" },
    { value: "inappropriate", label: "Inappropriate Content" }
  ];

  const handleSubmit = () => {
    if (!selectedReason) {
      alert("Please select a reason for reporting");
      return;
    }

    setIsSubmitting(true);

    try {
      FeedbackManager.reportQuestion(
        questionId,
        selectedReason,
        additionalComments,
        userId || "anonymous"
      );

      // Close modal
      setIsOpen(false);
      setSelectedReason("");
      setAdditionalComments("");

      // Show thank you modal
      if (onReportSubmitted) {
        setTimeout(() => {
          onReportSubmitted();
        }, 300);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedReason("");
    setAdditionalComments("");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors flex items-center gap-1"
      >
        <span>🚩</span> Report Question
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Report Question</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 font-medium mb-1">Question:</p>
              <p className="text-sm text-gray-600">{question.question}</p>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Please help us improve the quiz by reporting issues you find.
            </p>

            <div className="space-y-3 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's wrong with this question? *
              </label>
              {reportReasons.map((reason) => (
                <label
                  key={reason.value}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">
                      {reason.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                maxLength={500}
                placeholder="Please provide any additional details..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                {additionalComments.length}/500 characters
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                Your report will be reviewed by our team. Thank you for helping us maintain quality!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportModal;