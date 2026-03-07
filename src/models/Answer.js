import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionSession",
        required: true
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    },

    responder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    answerText: {
        type: String,
        required: true
    },

    isCorrect: {
        type: Boolean,
        default: null,
    }
}, {timestamps: true})


const Answer = mongoose.models.Answer || mongoose.model("Answer", answerSchema);

export default Answer;