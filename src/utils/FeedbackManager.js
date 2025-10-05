const FeedbackManager = {
    initializeFeedbackSystem: () => {
        const feedbackData = localStorage.getItem('questionFeedback');
        if (!feedbackData) {
            localStorage.setItem('questionFeedback', JSON.stringify({}));
        }
        const userData = localStorage.getItem('userFeedbackHistory');
        if (!userData) {
            localStorage.setItem('userFeedbackHistory', JSON.stringify({
                ratings: [],
                reports: [],
                comments: []
            }));
        }
    },

    getQuestionFeedback: (questionId) => {
        const allFeedback = JSON.parse(localStorage.getItem('questionFeedback') || '{}');
        return allFeedback[questionId] || {
            ratings: [],
            averageRating: 0,
            totalRatings: 0,
            reports: [],
            comments: [],
            status: 'approved'
        };
    },

    addRating: (questionId, userId, rating) => {
        const allFeedback = JSON.parse(localStorage.getItem('questionFeedback') || '{}');
        const questionFeedback = allFeedback[questionId] || {
            ratings: [],
            averageRating: 0,
            totalRatings: 0,
            reports: [],
            comments: [],
            status: 'approved'
        };

        const existingRatingIndex = questionFeedback.ratings.findIndex(r => r.userId === userId);
        
        if (existingRatingIndex !== -1) {
            questionFeedback.ratings[existingRatingIndex] = {
                userId,
                rating: Number(rating),
                timestamp: Date.now()
            };
        } else {
            questionFeedback.ratings.push({
                userId,
                rating: Number(rating),
                timestamp: Date.now()
            });
        }

        const totalRating = questionFeedback.ratings.reduce((sum, r) => sum + Number(r.rating), 0);
        questionFeedback.averageRating = questionFeedback.ratings.length > 0 
            ? parseFloat((totalRating / questionFeedback.ratings.length).toFixed(1))
            : 0;
        questionFeedback.totalRatings = questionFeedback.ratings.length;

        allFeedback[questionId] = questionFeedback;
        localStorage.setItem('questionFeedback', JSON.stringify(allFeedback));

        FeedbackManager.addToUserHistory('ratings', {
            questionId,
            rating: Number(rating),
            timestamp: Date.now()
        });

        return questionFeedback;
    },

    getUserRating: (questionId, userId = 'anonymous') => {
        const feedback = FeedbackManager.getQuestionFeedback(questionId);
        const userRating = feedback.ratings.find(r => r.userId === userId);
        return userRating ? userRating.rating : null;
    },

    reportQuestion: (questionId, reason, additionalComments) => {
        const allFeedback = JSON.parse(localStorage.getItem('questionFeedback') || '{}');
        const questionFeedback = allFeedback[questionId] || {
            ratings: [],
            averageRating: 0,
            totalRatings: 0,
            reports: [],
            comments: [],
            status: 'approved'
        };

        const report = {
            userId: 'anonymous',
            reason,
            additionalComments,
            timestamp: Date.now(),
            id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        questionFeedback.reports.push(report);
        
        if (questionFeedback.reports.length >= 2) {
            questionFeedback.status = 'under_review';
        }

        allFeedback[questionId] = questionFeedback;
        localStorage.setItem('questionFeedback', JSON.stringify(allFeedback));

        FeedbackManager.addToUserHistory('reports', {
            questionId,
            reason,
            additionalComments,
            timestamp: Date.now()
        });

        return true;
    },

    addComment: (questionId, commentText, _userId = 'anonymous', username = 'User') => {
        const allFeedback = JSON.parse(localStorage.getItem('questionFeedback') || '{}');
        const questionFeedback = allFeedback[questionId] || {
            ratings: [],
            averageRating: 0,
            totalRatings: 0,
            reports: [],
            comments: [],
            status: 'approved'
        };

        const comment = {
            id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: _userId,
            username,
            text: commentText,
            likes: 0,
            likedBy: [],
            timestamp: Date.now(),
            flagged: false,
            removed: false,
            reportCount: 0
        };

        questionFeedback.comments.push(comment);

        allFeedback[questionId] = questionFeedback;
        localStorage.setItem('questionFeedback', JSON.stringify(allFeedback));

        FeedbackManager.addToUserHistory('comments', {
            questionId,
            commentId: comment.id,
            text: commentText,
            timestamp: Date.now()
        });

        return comment;
    },

    likeComment: (questionId, commentId, userId = 'anonymous') => {
        const allFeedback = JSON.parse(localStorage.getItem('questionFeedback') || '{}');
        const questionFeedback = allFeedback[questionId];
        
        if (!questionFeedback) return false;

        const comment = questionFeedback.comments.find(c => c.id === commentId);
        if (!comment) return false;

        if (!comment.likedBy) {
            comment.likedBy = [];
        }

        const likedIndex = comment.likedBy.indexOf(userId);
        
        if (likedIndex === -1) {
            comment.likedBy.push(userId);
            comment.likes = (comment.likes || 0) + 1;
        } else {
            comment.likedBy.splice(likedIndex, 1);
            comment.likes = Math.max(0, (comment.likes || 0) - 1);
        }

        allFeedback[questionId] = questionFeedback;
        localStorage.setItem('questionFeedback', JSON.stringify(allFeedback));

        return true;
    },

    deleteComment: (questionId, commentId, userId = 'anonymous') => {
        const allFeedback = JSON.parse(localStorage.getItem('questionFeedback') || '{}');
        const questionFeedback = allFeedback[questionId];
        
        if (!questionFeedback) return false;

        const comment = questionFeedback.comments.find(c => c.id === commentId && c.userId === userId);
        
        if (!comment) return false;

        comment.removed = true;

        allFeedback[questionId] = questionFeedback;
        localStorage.setItem('questionFeedback', JSON.stringify(allFeedback));

        FeedbackManager.removeFromUserHistory('comments', commentId);

        return true;
    },

    reportComment: (questionId, commentId) => {
        const allFeedback = JSON.parse(localStorage.getItem('questionFeedback') || '{}');
        const questionFeedback = allFeedback[questionId];
        
        if (!questionFeedback) return false;

        const comment = questionFeedback.comments.find(c => c.id === commentId);
        if (!comment) return false;

        comment.reportCount = (comment.reportCount || 0) + 1;
        if (comment.reportCount >= 2) {
            comment.flagged = true;
        }

        allFeedback[questionId] = questionFeedback;
        localStorage.setItem('questionFeedback', JSON.stringify(allFeedback));

        return true;
    },

    getCommentsSorted: (questionId, sortBy = 'recent') => {
        const feedback = FeedbackManager.getQuestionFeedback(questionId);
        const comments = [...feedback.comments].filter(c => !c.removed);

        if (sortBy === 'recent') {
            return comments.sort((a, b) => b.timestamp - a.timestamp);
        } else if (sortBy === 'likes') {
            return comments.sort((a, b) => b.likes - a.likes);
        }

        return comments;
    },

    addToUserHistory: (type, data) => {
        const history = JSON.parse(localStorage.getItem('userFeedbackHistory') || '{}');
        if (!history[type]) history[type] = [];
        history[type].push(data);
        localStorage.setItem('userFeedbackHistory', JSON.stringify(history));
    },

    removeFromUserHistory: (type, id) => {
        const history = JSON.parse(localStorage.getItem('userFeedbackHistory') || '{}');
        if (!history[type]) return;
        
        if (type === 'comments') {
            history[type] = history[type].filter(item => item.commentId !== id);
        }
        
        localStorage.setItem('userFeedbackHistory', JSON.stringify(history));
    },

    getUserFeedbackHistory: () => {
        return JSON.parse(localStorage.getItem('userFeedbackHistory') || '{"ratings":[],"reports":[],"comments":[]}');
    },

    seedDemoData: () => {
        const demoComments = [
            { username: 'QuizMaster', text: 'Great question! Really tests understanding.', likes: 15 },
            { username: 'StudentA', text: 'The explanation could be clearer.', likes: 8 },
            { username: 'TeacherB', text: 'I use this in my classes. Very effective.', likes: 12 }
        ];

        const allFeedback = JSON.parse(localStorage.getItem('questionFeedback') || '{}');
        
        Object.keys(allFeedback).forEach(questionId => {
            if (allFeedback[questionId].comments.length === 0) {
                demoComments.forEach((demo, idx) => {
                    allFeedback[questionId].comments.push({
                        id: `demo_comment_${questionId}_${idx}`,
                        userId: `demo_user_${idx}`,
                        username: demo.username,
                        text: demo.text,
                        likes: demo.likes,
                        likedBy: [],
                        timestamp: Date.now() - (idx * 3600000),
                        flagged: false,
                        removed: false,
                        reportCount: 0
                    });
                });
            }
        });

        localStorage.setItem('questionFeedback', JSON.stringify(allFeedback));
    }
};

export default FeedbackManager;