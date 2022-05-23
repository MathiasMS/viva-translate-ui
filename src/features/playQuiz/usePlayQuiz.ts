import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {IQuiz} from "../../entities/Quiz/interfaces";
import { playQuiz as playQuizAction } from '../playQuiz/playQuiz.slice'

const usePlayQuiz = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const playQuiz = (quiz: IQuiz) => {
        dispatch(playQuizAction(quiz));
        navigate(`${quiz._id}/play`);
    };

    return { playQuiz };
};

export default usePlayQuiz;
