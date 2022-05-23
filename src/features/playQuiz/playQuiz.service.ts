import { serviceSlice } from "../../app/serviceSlice";
import {IOption, OptionId, QuestionId} from "../../entities/Question/interfaces";
import {QuizId} from "../../entities/Quiz/interfaces";

export interface IAnswerQuestionRequest {
    quizId: QuizId;
    questionId: QuestionId;
    optionId: OptionId;
}

const extendedApiSlice = serviceSlice.injectEndpoints({
    endpoints: (builder) => ({
        answerQuestion: builder.mutation<IOption, IAnswerQuestionRequest>({
            query: ({ questionId, optionId, quizId }) => ({
                url: `quizzes/${quizId}/answer`,
                method: "POST",
                body: { questionId, optionId },
            }),
        }),
    }),
});

export const { useAnswerQuestionMutation } = extendedApiSlice;
