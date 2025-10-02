/**
 * BonusManager - Utility for managing bonus wheel rewards
 */

const BonusManager = {
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
};

export default BonusManager;
