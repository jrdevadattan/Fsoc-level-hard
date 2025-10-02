class BookmarkManager {
  static STORAGE_KEY = 'quiz_bookmarks';
  static MAX_BOOKMARKS = 50;

  static getBookmarks() {
    try {
      const bookmarks = localStorage.getItem(this.STORAGE_KEY);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  static saveBookmarks(bookmarks) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
      return true;
    } catch (error) {
      console.error('Error saving bookmarks:', error);
      return false;
    }
  }

  static isBookmarked(questionId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(bookmark => bookmark.id === questionId);
  }

  static addBookmark(question) {
    const bookmarks = this.getBookmarks();

    // Check if already bookmarked
    if (this.isBookmarked(question.id)) {
      return { success: false, message: 'Question already bookmarked' };
    }

    // Check bookmark limit
    if (bookmarks.length >= this.MAX_BOOKMARKS) {
      return { success: false, message: `Maximum ${this.MAX_BOOKMARKS} bookmarks allowed` };
    }

    // Create bookmark object with all necessary data
    const bookmark = {
      id: question.id || this.generateQuestionId(question),
      question: question.question,
      answers: question.answers,
      correct_answer: question.correct_answer,
      category: question.category,
      difficulty: question.difficulty,
      type: question.type,
      bookmarkedAt: new Date().toISOString()
    };

    bookmarks.unshift(bookmark); // Add to beginning

    if (this.saveBookmarks(bookmarks)) {
      return { success: true, message: 'Question bookmarked successfully' };
    }

    return { success: false, message: 'Failed to save bookmark' };
  }

  static removeBookmark(questionId) {
    const bookmarks = this.getBookmarks();
    const filteredBookmarks = bookmarks.filter(bookmark => bookmark.id !== questionId);

    if (this.saveBookmarks(filteredBookmarks)) {
      return { success: true, message: 'Bookmark removed successfully' };
    }

    return { success: false, message: 'Failed to remove bookmark' };
  }

  static toggleBookmark(question) {
    const questionId = question.id || this.generateQuestionId(question);

    if (this.isBookmarked(questionId)) {
      return this.removeBookmark(questionId);
    } else {
      return this.addBookmark(question);
    }
  }

  static clearAllBookmarks() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return { success: true, message: 'All bookmarks cleared' };
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      return { success: false, message: 'Failed to clear bookmarks' };
    }
  }

  static getBookmarkCount() {
    return this.getBookmarks().length;
  }

  static generateQuestionId(question) {
    // Generate a unique ID based on question content
    const content = question.question + question.correct_answer + question.category;
    return btoa(content).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  static exportBookmarks() {
    const bookmarks = this.getBookmarks();
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `quiz-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  static importBookmarks(fileContent) {
    try {
      const importedBookmarks = JSON.parse(fileContent);
      const currentBookmarks = this.getBookmarks();

      // Merge bookmarks, avoiding duplicates
      const mergedBookmarks = [...currentBookmarks];

      importedBookmarks.forEach(importedBookmark => {
        if (!this.isBookmarked(importedBookmark.id)) {
          mergedBookmarks.push(importedBookmark);
        }
      });

      // Respect the limit
      const finalBookmarks = mergedBookmarks.slice(0, this.MAX_BOOKMARKS);

      if (this.saveBookmarks(finalBookmarks)) {
        return {
          success: true,
          message: `Successfully imported ${finalBookmarks.length - currentBookmarks.length} new bookmarks`
        };
      }

      return { success: false, message: 'Failed to save imported bookmarks' };
    } catch (error) {
      console.error('Error importing bookmarks:', error);
      return { success: false, message: 'Invalid bookmark file format' };
    }
  }
}

export default BookmarkManager;
