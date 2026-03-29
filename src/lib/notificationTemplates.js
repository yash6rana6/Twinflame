export const notificationTemplates = {
  timeline_invite: (ownerName, timelineTitle) => ({
    title: "New Love Invitation 💕",
    message: `${ownerName} ne aapko "${timelineTitle}" timeline mein invite kiya hai.`,
  }),

  new_event: (partnerName, date) => ({
    title: "New Memory Added ❤️",
    message: `${partnerName} ne ${date} ka ek khubsurat memory add kiya.`,
  }),

  level_up: (newLevel) => ({
    title: "Level Up! 🎉",
    message: `Congratulations! Aapka level ab ${newLevel} ho gaya hai.`,
  }),

  // Naya feature add karne ke liye bas yahan ek entry add kar do
  quiz_completed: (quizTitle, score, partnerName) => ({
    title: "Quiz Completed ❤️",
    message: `${partnerName} ne "${quizTitle}" quiz complete kiya. Score: ${score}%`,
  }),

  new_quiz_available: (quizTitle) => ({
    title: "New Fun Quiz Available",
    message: `Naya quiz "${quizTitle}" aa gaya hai. Abhi khelo!`,
  }),
};