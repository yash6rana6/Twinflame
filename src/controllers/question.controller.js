import {
  getPublicQuestions,
  getQuestionsForUser,
  createCustomQuestion,
  getMyQuestions,
} from "@/services/question.service";

export async function getPublicQuestionsController() {
  const questions = await getPublicQuestions();
  return {
    success: true,
    questions,
  };
}

export async function getQuestionsForUserController(user) {
  const questions = await getQuestionsForUser(user._id);
  return {
    success: true,
    questions,
  };
}

export async function createQuestionController(req, user) {
  const body = await req.json();

  if (!body.text?.trim()) {
    return {
      success: false,
      error: "Question text is required",
      status: 400,
    };
  }

  try {
    const question = await createCustomQuestion({
      text: body.text,
      user,
    });

    return {
      success: true,
      question: {
        _id: question._id,
        text: question.text,
        category: question.category,
        order: question.order,
      },
    };
  } catch (err) {
    if (err.message === "PREMIUM_REQUIRED") {
      return {
        success: false,
        error: "Premium subscription required to create custom questions",
        status: 403,
      };
    }

    if (err.message === "INVALID_QUESTION") {
      return {
        success: false,
        error: "Question text must be at least 5 characters",
        status: 400,
      };
    }

    throw err;
  }
}

export async function getMyQuestionsController(user) {
  const questions = await getMyQuestions(user._id);
  return {
    success: true,
    questions,
  };
}