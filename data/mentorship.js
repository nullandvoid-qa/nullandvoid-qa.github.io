/**
 * Mentorship Matching System
 * Pairs mentors with learners based on compatibility
 */

window.TG_MENTORSHIP = {
  /**
   * Mentor profile structure
   */
  mentorTemplate: {
    id: "mentor-1",
    name: "John Doe",
    avatar: "🎓",
    experience_years: 5,
    specialties: ["automation", "performance", "api-testing"],
    languages: ["pt", "en"],
    timezone: "America/Sao_Paulo",
    availability: {
      monday: ["14:00-16:00", "19:00-21:00"],
      wednesday: ["19:00-21:00"],
      saturday: ["10:00-12:00"]
    },
    bio: "QA Sênior com 5 anos em automação e performance testing",
    max_mentees: 3,
    current_mentees: 1,
    rating: 4.8,
    reviews: 12,
    verified: true
  },

  /**
   * Learner profile structure
   */
  learnerTemplate: {
    id: "learner-1",
    name: "Jane Silva",
    avatar: "🌱",
    current_level: "intermediate",
    goals: ["mastery-automation", "performance-testing"],
    learning_style: "hands-on",
    timezone: "America/Sao_Paulo",
    availability: {
      monday: ["14:00-16:00"],
      thursday: ["19:00-20:30"],
      saturday: ["10:00-12:00"]
    },
    interests: ["automation", "ci-cd"],
    languages: ["pt"],
    experience_areas: ["web-automation", "api-testing"],
    preferred_mentor_style: "collaborative"
  },

  /**
   * Get all mentors from localStorage
   */
  getMentors: function() {
    return JSON.parse(localStorage.getItem('tg-mentors') || '[]');
  },

  /**
   * Get all learners from localStorage
   */
  getLearners: function() {
    return JSON.parse(localStorage.getItem('tg-learners') || '[]');
  },

  /**
   * Register mentor
   * @param {Object} mentor - Mentor profile
   */
  registerMentor: function(mentor) {
    const mentors = this.getMentors();
    mentor.id = 'mentor-' + Date.now();
    mentor.registered_at = new Date().toISOString();
    mentor.current_mentees = 0;
    mentor.rating = 0;
    mentor.reviews = 0;
    mentors.push(mentor);
    localStorage.setItem('tg-mentors', JSON.stringify(mentors));
    return mentor;
  },

  /**
   * Register learner
   * @param {Object} learner - Learner profile
   */
  registerLearner: function(learner) {
    const learners = this.getLearners();
    learner.id = 'learner-' + Date.now();
    learner.registered_at = new Date().toISOString();
    learner.matched_mentor = null;
    learners.push(learner);
    localStorage.setItem('tg-learners', JSON.stringify(learners));
    return learner;
  },

  /**
   * Calculate compatibility score between mentor and learner
   * @param {Object} mentor
   * @param {Object} learner
   * @returns {number} Score 0-100
   */
  calculateCompatibility: function(mentor, learner) {
    let score = 0;

    // 1. Specialty match (30%)
    const specialtyMatch = mentor.specialties.filter(s => 
      learner.goals.includes('mastery-' + s) || learner.interests.includes(s)
    ).length;
    const specialtyScore = (specialtyMatch / Math.max(mentor.specialties.length, 1)) * 30;
    score += specialtyScore;

    // 2. Language compatibility (15%)
    const languageMatch = mentor.languages.some(l => learner.languages.includes(l));
    score += languageMatch ? 15 : 0;

    // 3. Timezone overlap (20%)
    const timezoneMatch = mentor.timezone === learner.timezone;
    score += timezoneMatch ? 20 : 10;

    // 4. Availability overlap (20%)
    const mentorDays = Object.keys(mentor.availability);
    const learnerDays = Object.keys(learner.availability);
    const dayOverlap = mentorDays.filter(d => learnerDays.includes(d)).length;
    const availabilityScore = (dayOverlap / Math.max(mentorDays.length, 1)) * 20;
    score += availabilityScore;

    // 5. Mentor not overloaded (15%)
    const capacity = (mentor.max_mentees - mentor.current_mentees) / mentor.max_mentees;
    score += Math.max(0, capacity * 15);

    return Math.round(score);
  },

  /**
   * Find best mentors for learner
   * @param {Object} learner
   * @returns {Array} Top 3 compatible mentors
   */
  findBestMentors: function(learner) {
    const mentors = this.getMentors();
    
    const scored = mentors
      .filter(m => m.current_mentees < m.max_mentees) // Only available mentors
      .map(mentor => ({
        mentor,
        score: this.calculateCompatibility(mentor, learner)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return scored;
  },

  /**
   * Create match between mentor and learner
   * @param {string} mentorId
   * @param {string} learnerId
   * @returns {Object} Match record
   */
  createMatch: function(mentorId, learnerId) {
    const mentors = this.getMentors();
    const learners = this.getLearners();

    const mentor = mentors.find(m => m.id === mentorId);
    const learner = learners.find(l => l.id === learnerId);

    if (!mentor || !learner) {
      return { error: 'Mentor ou learner não encontrado' };
    }

    if (mentor.current_mentees >= mentor.max_mentees) {
      return { error: 'Mentor não tem disponibilidade' };
    }

    // Create match
    const match = {
      id: 'match-' + Date.now(),
      mentor_id: mentorId,
      learner_id: learnerId,
      created_at: new Date().toISOString(),
      status: 'active',
      meetings: [],
      messages: [],
      goals: learner.goals
    };

    // Update mentor
    mentor.current_mentees += 1;

    // Update learner
    learner.matched_mentor = mentorId;

    localStorage.setItem('tg-mentors', JSON.stringify(mentors));
    localStorage.setItem('tg-learners', JSON.stringify(learners));

    const matches = JSON.parse(localStorage.getItem('tg-mentorship-matches') || '[]');
    matches.push(match);
    localStorage.setItem('tg-mentorship-matches', JSON.stringify(matches));

    return match;
  },

  /**
   * Get active matches
   * @returns {Array} All active matches
   */
  getMatches: function() {
    return JSON.parse(localStorage.getItem('tg-mentorship-matches') || '[]')
      .filter(m => m.status === 'active');
  },

  /**
   * Add message to match
   * @param {string} matchId
   * @param {string} senderId
   * @param {string} message
   */
  addMessage: function(matchId, senderId, message) {
    const matches = JSON.parse(localStorage.getItem('tg-mentorship-matches') || '[]');
    const match = matches.find(m => m.id === matchId);

    if (!match) return { error: 'Match não encontrado' };

    match.messages.push({
      sender_id: senderId,
      text: message,
      timestamp: new Date().toISOString(),
      read: false
    });

    localStorage.setItem('tg-mentorship-matches', JSON.stringify(matches));
    return match.messages[match.messages.length - 1];
  },

  /**
   * Schedule meeting between mentor and learner
   * @param {string} matchId
   * @param {Object} meeting - { date, time, duration, topic }
   */
  scheduleMeeting: function(matchId, meeting) {
    const matches = JSON.parse(localStorage.getItem('tg-mentorship-matches') || '[]');
    const match = matches.find(m => m.id === matchId);

    if (!match) return { error: 'Match não encontrado' };

    match.meetings.push({
      id: 'meeting-' + Date.now(),
      scheduled_at: new Date().toISOString(),
      date: meeting.date,
      time: meeting.time,
      duration: meeting.duration || 60,
      topic: meeting.topic,
      status: 'scheduled',
      notes: ''
    });

    localStorage.setItem('tg-mentorship-matches', JSON.stringify(matches));
    return match.meetings[match.meetings.length - 1];
  },

  /**
   * Rate mentor after match ends
   * @param {string} mentorId
   * @param {number} rating - 1-5
   * @param {string} review
   */
  rateMentor: function(mentorId, rating, review) {
    const mentors = this.getMentors();
    const mentor = mentors.find(m => m.id === mentorId);

    if (!mentor) return { error: 'Mentor não encontrado' };

    mentor.reviews = (mentor.reviews || 0) + 1;
    mentor.rating = ((mentor.rating * (mentor.reviews - 1)) + rating) / mentor.reviews;

    localStorage.setItem('tg-mentors', JSON.stringify(mentors));
    return mentor;
  },

  /**
   * End mentorship match
   * @param {string} matchId
   */
  endMatch: function(matchId) {
    const matches = JSON.parse(localStorage.getItem('tg-mentorship-matches') || '[]');
    const match = matches.find(m => m.id === matchId);

    if (!match) return { error: 'Match não encontrado' };

    match.status = 'ended';
    match.ended_at = new Date().toISOString();

    // Decrement mentor's current_mentees
    const mentors = this.getMentors();
    const mentor = mentors.find(m => m.id === match.mentor_id);
    if (mentor) {
      mentor.current_mentees = Math.max(0, mentor.current_mentees - 1);
      localStorage.setItem('tg-mentors', JSON.stringify(mentors));
    }

    localStorage.setItem('tg-mentorship-matches', JSON.stringify(matches));
    return match;
  }
};
