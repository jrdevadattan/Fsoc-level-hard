import { useState, useEffect } from "react";

const ThankYouModal = ({ 
  isOpen, 
  onClose, 
  feedbackType, // 'rating', 'report', 'comment'
  onRateAnother 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getContent = () => {
    switch (feedbackType) {
      case 'rating':
        return {
          icon: '⭐',
          title: 'Thank You for Rating!',
          message: 'Your rating helps us identify high-quality questions and improve the quiz experience for everyone.',
          details: [
            'Ratings help other learners find the best questions',
            'We use your feedback to improve question quality',
            'High-rated questions are featured more prominently'
          ]
        };
      case 'report':
        return {
          icon: '🚩',
          title: 'Report Submitted Successfully!',
          message: 'Thank you for helping us maintain quality. Our team will review your report shortly.',
          details: [
            'Reports are reviewed within 24-48 hours',
            'Questions with multiple reports are prioritized',
            'We may reach out if we need more information',
            'Your feedback helps keep the quiz accurate'
          ]
        };
      case 'comment':
        return {
          icon: '💬',
          title: 'Comment Posted!',
          message: 'Thank you for sharing your thoughts! Your insights help other learners understand the material better.',
          details: [
            'Comments create a learning community',
            'Other users can learn from your perspective',
            'Helpful comments get featured',
            'You can edit or delete your comment anytime'
          ]
        };
      default:
        return {
          icon: '✓',
          title: 'Thank You!',
          message: 'Your feedback has been recorded.',
          details: []
        };
    }
  };

  const content = getContent();

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${show ? 'scale-100' : 'scale-95'}`}>
        {/* Header with Icon */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-xl p-6 text-center">
          <div className="text-6xl mb-3">{content.icon}</div>
          <h2 className="text-2xl font-bold text-white">{content.title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-center mb-4">
            {content.message}
          </p>

          {/* Details List */}
          {content.details.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-purple-900 mb-2">How Your Feedback Helps:</h3>
              <ul className="space-y-2">
                {content.details.map((detail, index) => (
                  <li key={index} className="text-sm text-purple-800 flex items-start">
                    <span className="text-purple-500 mr-2">✓</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Impact Stats */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">🎯 Community Impact</p>
              <p className="text-xs text-gray-500">
                Users like you have contributed{' '}
                <strong className="text-purple-600">10,000+ ratings</strong>,{' '}
                <strong className="text-purple-600">500+ reports</strong>, and{' '}
                <strong className="text-purple-600">2,000+ comments</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {feedbackType === 'rating' && onRateAnother && (
              <button
                onClick={() => {
                  handleClose();
                  onRateAnother();
                }}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Rate Another Question
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Continue Learning
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-xl px-6 py-3 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Your feedback is anonymous and helps improve the quiz for everyone
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYouModal;