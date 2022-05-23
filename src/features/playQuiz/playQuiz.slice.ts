import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { IQuiz, QuizId } from "../../entities/Quiz/interfaces";
import { RootState } from "../../app/store";

export type QuizGameStatus = "IDLE" | "IN PROGRESS" | "COMPLETED";

type ActiveQuizzes = Record<QuizId, IQuizGame>;

type AnswerStatus = "INCORRECT" | "CORRECT";

interface AnsweredQuestion {
    status: AnswerStatus;
}

interface IQuizGame {
    quiz: IQuiz;
    currentQuestion: number;
    answeredQuestions: AnsweredQuestion[];
    status: QuizGameStatus;
}

export interface QuizzesState {
    activeQuizzes: ActiveQuizzes;
}

const initialState: QuizzesState = {
    activeQuizzes: {},
};

const updateQuestionStatus = (quizGame: IQuizGame, currentQuestion: number, isAnswerValid: boolean) =>
    (quizGame.answeredQuestions[currentQuestion] = { status: isAnswerValid ? "CORRECT" : "INCORRECT" });

const updateQuizStatus = (quizGame: IQuizGame) => {
    quizGame.currentQuestion = 0;
    quizGame.status = "COMPLETED";
};

export const playQuizSlice = createSlice({
    name: "playQuiz",
    initialState,
    reducers: {
        playQuiz: (state, action: PayloadAction<IQuiz>) => {
            const newQuizGame = {
                quiz: action.payload,
                currentQuestion: 0,
                answeredQuestions: [],
                status: "IN PROGRESS" as QuizGameStatus,
            };

            state.activeQuizzes = { ...state.activeQuizzes, [action.payload._id]: newQuizGame };
        },

        answerQuestion: (state, action: PayloadAction<{ quizId: QuizId; isCorrect: boolean }>) => {
            const { activeQuizzes } = state;

            const { quizId, isCorrect } = action.payload;

            const activeQuiz = activeQuizzes[quizId];

            const currentQuestion = activeQuiz.currentQuestion;

            updateQuestionStatus(activeQuiz, currentQuestion, isCorrect);
        },
        nextQuestion: (state, action: PayloadAction<{ quizId: QuizId }>) => {
            const { activeQuizzes } = state;

            const { quizId } = action.payload;

            const activeQuiz = activeQuizzes[quizId];

            const {
                quiz: { questions },
                currentQuestion,
            } = activeQuiz;

            const isLastQuestion = questions.length - 1 === currentQuestion;

            if (isLastQuestion) {
                updateQuizStatus(activeQuiz);
            } else {
                activeQuiz.currentQuestion++;
            }
        },
    },
});

export const getQuizBySelector = (quizId: QuizId) => (state: RootState) => state.playQuiz.activeQuizzes[quizId];

export const getActiveQuizzes =  (state: RootState) => state.playQuiz.activeQuizzes;

export const getQuizStatus = (quizId: QuizId) =>
    createSelector(getQuizBySelector(quizId), (quiz: IQuizGame) => {
        return quiz.status;
});

export const getQuizName = (quizId: QuizId) =>
    createSelector(getQuizBySelector(quizId), (quizGame: IQuizGame) => {
        return quizGame.quiz.name;
});

export const getQuizCurrentQuestionSelector = (quizId: QuizId) =>
    createSelector(getQuizBySelector(quizId), (quizGame: IQuizGame) => {
        const question = quizGame.currentQuestion
        const current = quizGame.quiz.questions[question]

        return { questionId: current._id, questionName: current.name, questionDescription: current.description, options: current.options};
    });


export const getQuizScore = (quizId: QuizId) =>
    createSelector([getQuizBySelector(quizId)], (quiz: IQuizGame) => {
        let score = 0;

        quiz.answeredQuestions.forEach((question) => {
            if (question.status === "CORRECT") {
                score++;
            }
        });

        const totalQuestions = quiz.answeredQuestions.length;

        return [totalQuestions, score];
});

export const { answerQuestion, playQuiz, nextQuestion } = playQuizSlice.actions;

export default playQuizSlice.reducer;
