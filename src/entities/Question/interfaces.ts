export type OptionId = string;
type OptionName = string;

export interface IOption {
    _id?: OptionId
    name: OptionName;
    isCorrect: boolean;
}

export type QuestionId = string;
type QuestionName = string;
type QuestionDescription = string;

export interface IQuestion {
    _id?: QuestionId;
    name: QuestionName;
    description?: QuestionDescription;
    options: IOption[];
}
