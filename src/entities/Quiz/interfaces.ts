import { IQuestion } from "../Question/interfaces";

export type QuizId = string;
type QuizName = string;
type QuizDescription = string;
type CreatedByQuiz = string;

export interface IQuiz {
    _id: QuizId;
    name: QuizName;
    description: QuizDescription;
    questions: IQuestion[];
    createdBy: CreatedByQuiz;
}
