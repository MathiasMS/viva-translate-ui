import { useDispatch } from "react-redux";
import { useAnswerQuestionMutation } from "./playQuiz.service";
import { answerQuestion as answerQuestionAction } from "../playQuiz/playQuiz.slice";
import {notifyErrors} from "../../utils/error";
import {IOption, OptionId, QuestionId} from "../../entities/Question/interfaces";
import {QuizId} from "../../entities/Quiz/interfaces";

const useAnswerQuestion = (quizId: QuizId) => {
    const dispatch = useDispatch();
    const [answerQuestionMutation] = useAnswerQuestionMutation();

    const answerQuestion = async ({ questionId, optionId }: { questionId: QuestionId; optionId: OptionId }) => {
        try {
            const option: IOption = await  answerQuestionMutation({ questionId, optionId, quizId }).unwrap();

            if (option) {
                dispatch(answerQuestionAction({ quizId, isCorrect: option.isCorrect }));
            }
            return option.isCorrect
        } catch (error: any) {
            const { data } = error
            notifyErrors(data)
        }
    };

    return { answerQuestion };
};

export default useAnswerQuestion;
