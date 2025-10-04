/**
 * BonusManager - Utility for managing bonus wheel rewards and history
 */

const BonusManager = {
  /**
   * Save bonus reward to history
   */
  saveBonusToHistory: (reward, originalScore, finalScore, totalQuestions) => {
    try {
      const history = BonusManager.getBonusHistory();
      
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        reward: {
          label: reward.label,
          points: reward.points,
          isMultiplier: reward.isMultiplier || false,
        },
        originalScore,
        finalScore,
        totalQuestions,
        percentage: Math.round((finalScore / totalQuestions) * 100),
      };

      history.unshift(entry); // Add to beginning
      
      // Keep only last 10 entries
      const trimmedHistory = history.slice(0, 10);
      
      localStorage.setItem('bonusHistory', JSON.stringify(trimmedHistory));
      
      return { success: true, entry };
    } catch (error) {
      console.error('Failed to save bonus history:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get bonus history
   */
  getBonusHistory: () => {
    try {
      const history = localStorage.getItem('bonusHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Failed to load bonus history:', error);
      return [];
    }
  },

  /**
   * Clear bonus history
   */
  clearBonusHistory: () => {
    try {
      localStorage.removeItem('bonusHistory');
      return { success: true };
    } catch (error) {
      console.error('Failed to clear bonus history:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get bonus statistics
   */
  getBonusStats: () => {
    try {
      const history = BonusManager.getBonusHistory();
      
      if (history.length === 0) {
        return {
          totalSpins: 0,
          totalBonusPoints: 0,
          averageBonus: 0,
          highestBonus: 0,
          multiplierCount: 0,
        };
      }

      const totalSpins = history.length;
      const totalBonusPoints = history.reduce((sum, entry) => {
        return sum + (entry.finalScore - entry.originalScore);
      }, 0);
      
      const averageBonus = Math.round(totalBonusPoints / totalSpins);
      
      const highestBonus = Math.max(...history.map(entry => 
        entry.finalScore - entry.originalScore
      ));
      
      const multiplierCount = history.filter(entry => 
        entry.reward.isMultiplier
      ).length;

      return {
        totalSpins,
        totalBonusPoints,
        averageBonus,
        highestBonus,
        multiplierCount,
      };
    } catch (error) {
      console.error('Failed to calculate bonus stats:', error);
      return null;
    }
  },

  /**
   * Check if user can spin (one per quiz session)
   */
  canSpin: () => {
    const wheelSpun = sessionStorage.getItem('wheelSpun');
    return wheelSpun !== 'true';
  },

  /**
   * Mark wheel as spun for current session
   */
  markWheelSpun: (bonusPoints) => {
    sessionStorage.setItem('wheelSpun', 'true');
    sessionStorage.setItem('lastBonus', bonusPoints.toString());
  },

  /**
   * Reset wheel spin state (for new quiz)
   */
  resetWheelState: () => {
    sessionStorage.removeItem('wheelSpun');
    sessionStorage.removeItem('lastBonus');
  },

  /**
   * Get last bonus from current session
   */
  getLastBonus: () => {
    const bonus = sessionStorage.getItem('lastBonus');
    return bonus ? parseInt(bonus, 10) : 0;
  },

  /**
   * Format date for display
   */
  formatDate: (isoDate) => {
    try {
      const date = new Date(isoDate);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  },

  /**
   * Export bonus history as JSON
   */
  exportHistory: () => {
    try {
      const history = BonusManager.getBonusHistory();
      const dataStr = JSON.stringify(history, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bonus-history-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to export history:', error);
      return { success: false, error: error.message };
    }
  },
};

export default BonusManager;