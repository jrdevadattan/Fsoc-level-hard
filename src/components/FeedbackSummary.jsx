import React from 'react';
import StarRating from './StarRating';

const FeedbackSummary = ({ feedback }) => {
    const { averageRating, totalRatings, reports, comments, status } = feedback;

    const getStatusBadge = () => {
        if (status === 'under_review') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                    <span>🔍</span>
                    Under Review
                </span>
            );
        }
        if (averageRating >= 4.5 && totalRatings >= 10) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    <span>✓</span>
                    Verified
                </span>
            );
        }
        if (averageRating >= 4.0 && totalRatings >= 5) {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    <span>⭐</span>
                    High Quality
                </span>
            );
        }
        return null;
    };

    const mostHelpfulComment = comments.length > 0
        ? comments.reduce((max, comment) => comment.likes > max.likes ? comment : max, comments[0])
        : null;

    return (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <StarRating 
                            initialRating={parseFloat(averageRating)} 
                            readonly 
                            size="sm" 
                        />
                        <span className="text-sm font-bold text-gray-800">
                            {averageRating > 0 ? averageRating : 'N/A'}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600">
                        {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                    </p>
                </div>
                {getStatusBadge()}
            </div>

            {reports.length > 0 && (
                <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-xs text-yellow-800 font-semibold">
                        {reports.length} {reports.length === 1 ? 'report' : 'reports'} received
                    </p>
                </div>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{comments.length} comments</span>
                </div>
                {reports.length > 0 && (
                    <div className="flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{reports.length} reports</span>
                    </div>
                )}
            </div>

            {mostHelpfulComment && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Most helpful comment:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{mostHelpfulComment.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500">by {mostHelpfulComment.username}</span>
                        <span className="text-xs text-purple-600">❤️ {mostHelpfulComment.likes}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackSummary;