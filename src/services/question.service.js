import Question from "@/models/Question";

/**
 * GET all public/system questions
 */
export async function getPublicQuestions() {
  return Question.find({
    source: "system",
    isActive: true,
  })
    .sort({ order: 1 })
    .select("_id text category order");
}

/**
 * GET questions for a logged-in user (system + their own)
 */
export async function getQuestionsForUser(userId) {
  return Question.find({
    isActive: true,
    $or: [{ source: "system" }, { createdBy: userId }],
  })
    .sort({ order: 1, createdAt: 1 })
    .select("_id text category source createdBy order");
}

/**
 * CREATE custom question (premium users only)
 */
export async function createCustomQuestion({ text, user }) {
  if (!user.isPremium) {
    throw new Error("PREMIUM_REQUIRED");
  }

  if (!text || text.trim().length < 5) {
    throw new Error("INVALID_QUESTION");
  }

  const lastQuestion = await Question.findOne({
    $or: [{ source: "system" }, { createdBy: user._id }],
  }).sort({ order: -1 });

  const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

  return Question.create({
    text: text.trim(),
    source: "user",
    createdBy: user._id,
    isPremium: true,
    order: nextOrder,
  });
}

/**
 * GET only my custom questions
 */
export async function getMyQuestions(userId) {
  return Question.find({
    createdBy: userId,
    isActive: true,
    source: "user",
  })
    .sort({ createdAt: -1 })
    .select("_id text category order createdAt");
}