/**
 * Discord Bot Integration
 * Handles leaderboard, challenges, and sync with Discord
 * @global getTodayChallenge
 */

window.TG_DISCORD = {
  /**
   * Get leaderboard from localStorage
   * @returns {Array} Top 10 users by points
   */
  getLeaderboard: function() {
    const leaderboard = JSON.parse(localStorage.getItem('tg-discord-leaderboard') || '[]');
    return leaderboard.sort((a, b) => b.points - a.points).slice(0, 10);
  },

  /**
   * Add points to user's Discord challenge
   * @param {string} userId - Discord user ID
   * @param {string} username - Discord username
   * @param {number} points - Points earned
   */
  addPoints: function(userId, username, points) {
    const leaderboard = JSON.parse(localStorage.getItem('tg-discord-leaderboard') || '[]');
    
    let user = leaderboard.find(u => u.userId === userId);
    if (!user) {
      user = {
        userId,
        username,
        points: 0,
        challenges_completed: 0,
        streak: 0,
        joined_at: new Date().toISOString()
      };
      leaderboard.push(user);
    }
    
    user.points += points;
    user.challenges_completed += 1;
    user.last_challenge_at = new Date().toISOString();
    
    localStorage.setItem('tg-discord-leaderboard', JSON.stringify(leaderboard));
    return user;
  },

  /**
   * Get user stats
   * @param {string} userId - Discord user ID
   * @returns {Object} User stats
   */
  getUserStats: function(userId) {
    const leaderboard = JSON.parse(localStorage.getItem('tg-discord-leaderboard') || '[]');
    return leaderboard.find(u => u.userId === userId) || null;
  },

  /**
   * Sync with Discord Webhook
   * Sends challenge completion to Discord bot
   * @param {Object} data - Challenge data
   */
  syncWithDiscord: function(data) {
    const webhookUrl = localStorage.getItem('tg-discord-webhook');
    if (!webhookUrl) {
      console.warn('[Discord] Webhook não configurado');
      return;
    }

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'challenge_completed',
        userId: data.userId,
        username: data.username,
        challengeId: data.challengeId,
        points: data.points,
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.warn('[Discord] Webhook sync failed:', err));
  },

  /**
   * Reset leaderboard weekly
   * Called every Monday at 00:00
   */
  resetWeeklyLeaderboard: function() {
    const lastReset = localStorage.getItem('tg-discord-last-reset');
    const today = new Date();
    
    // Check if it's Monday and if we haven't reset today
    if (today.getDay() === 1) {
      const lastResetDate = lastReset ? new Date(lastReset) : null;
      
      if (!lastResetDate || lastResetDate.toDateString() !== today.toDateString()) {
        // Archive old leaderboard
        const oldLeaderboard = JSON.parse(localStorage.getItem('tg-discord-leaderboard') || '[]');
        const archives = JSON.parse(localStorage.getItem('tg-discord-leaderboard-archives') || '[]');
        archives.push({
          week_of: today.toISOString(),
          data: oldLeaderboard
        });
        localStorage.setItem('tg-discord-leaderboard-archives', JSON.stringify(archives.slice(-4))); // Keep last 4 weeks
        
        // Reset current leaderboard (keep user data, reset points)
        const newLeaderboard = oldLeaderboard.map(user => ({
          ...user,
          points: 0,
          challenges_completed: 0,
          streak: 0
        }));
        localStorage.setItem('tg-discord-leaderboard', JSON.stringify(newLeaderboard));
        localStorage.setItem('tg-discord-last-reset', today.toISOString());
      }
    }
  },

  /**
   * Get challenge of the day
   * @returns {Object} Today's challenge
   */
  getDailyChallenge: function() {
    /* global getTodayChallenge */
    if (typeof getTodayChallenge === 'undefined') {
      console.warn('[Discord] daily-challenges.js não carregou');
      return null;
    }
    return getTodayChallenge();
  },

  /**
   * Submit answer to challenge
   * @param {string} userId - Discord user ID
   * @param {string} username - Discord username
   * @param {string} answer - User's answer
   * @returns {Object} Resultado (correct, points, feedback)
   */
  submitChallenge: function(userId, username, answer) {
    const challenge = this.getDailyChallenge();
    if (!challenge) {
      return { correct: false, feedback: 'Desafio não disponível' };
    }

    // Simple answer validation (case-insensitive, partial match)
    const userAnswer = answer.trim().toLowerCase();
    const expectedAnswer = challenge.correctAnswer.toLowerCase();
    
    // Accept if user's answer contains key parts of expected answer
    const keywords = expectedAnswer.split(/[,.;]/).map(k => k.trim()).filter(k => k.length > 5);
    const correct = keywords.some(keyword => userAnswer.includes(keyword));

    if (correct) {
      this.addPoints(userId, username, challenge.points);
      this.syncWithDiscord({
        userId,
        username,
        challengeId: challenge.id,
        points: challenge.points
      });
      
      return {
        correct: true,
        points: challenge.points,
        feedback: `✓ Correto! +${challenge.points} pontos`
      };
    } else {
      return {
        correct: false,
        feedback: `✗ Incorreto. A resposta era: "${challenge.correctAnswer}"`
      };
    }
  }
};

// Reset leaderboard weekly
setInterval(() => window.TG_DISCORD.resetWeeklyLeaderboard(), 3600000); // Check every hour
window.TG_DISCORD.resetWeeklyLeaderboard(); // Check on load
