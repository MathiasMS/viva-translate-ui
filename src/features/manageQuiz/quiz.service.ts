import { serviceSlice } from "../../app/serviceSlice";
import {IQuiz, QuizId} from "../../entities/Quiz/interfaces";
import {IQuestion} from "../../entities/Question/interfaces";

export type IQuizPaginated = {
    docs: Array<IQuiz>
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
}

interface IPaginatedRequest {
    page: number;
    limit: number;
}

export interface IQuizRequest {
    _id?: string
    questions?: IQuestion[]
    name: string;
    description?: string;
}

const QUIZ_BASE_URL = 'quizzes';

const extendedApiSlice = serviceSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPaginatedQuizzes: builder.query<IQuizPaginated, IPaginatedRequest>({
            query: ({ page, limit }) => ({
                url: QUIZ_BASE_URL,
                method: "GET",
                params: { page, limit}
            }),
        }),
        getOneQuizById: builder.query<IQuiz | null, QuizId | undefined>({
            query: (id) => ({
                url: `${QUIZ_BASE_URL}/${id}`,
                method: "GET",
            }),
        }),
        updateQuiz: builder.mutation<IQuiz, IQuiz>({
            query: (quiz) => ({
                url: `${QUIZ_BASE_URL}/${quiz._id}`,
                method: "PUT",
                body: quiz,
            }),
        }),
        createQuiz: builder.mutation<IQuiz, IQuizRequest>({
            query: (quiz) => ({
                url: `${QUIZ_BASE_URL}`,
                method: "POST",
                body: quiz,
            }),
        }),
        removeQuiz: builder.mutation<IQuiz, QuizId>({
            query: (quizId) => ({
                url: `${QUIZ_BASE_URL}/${quizId}`,
                method: "DELETE",
            }),
        }),
    }),
});

export const { useGetPaginatedQuizzesQuery, useGetOneQuizByIdQuery, useUpdateQuizMutation, useCreateQuizMutation, useRemoveQuizMutation } = extendedApiSlice;
