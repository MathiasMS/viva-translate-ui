import React, {useState} from 'react';
import {Container, Radio} from "@mui/material";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {
    getQuizCurrentQuestionSelector,
    getQuizName,
    getQuizScore,
    getQuizStatus
} from "../../features/playQuiz/playQuiz.slice";
import { useNavigate } from 'react-router-dom';
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import {IOption} from "../../entities/Question/interfaces";
import FormControlLabel from "@mui/material/FormControlLabel";
import Header from "../../components/Header";
import useAnswerQuestion from "../../features/playQuiz/useAnswerQuestion";
import { nextQuestion as nextQuestionAction } from "../../features/playQuiz/playQuiz.slice";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import BackButton from "../../components/BackButton";

const PlayQuiz = () => {
    const params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { quizId = ""} = params;

    const { answerQuestion } = useAnswerQuestion(quizId)

    const {questionId, questionName, questionDescription, options} = useSelector(getQuizCurrentQuestionSelector(quizId))

    const [totalQuestions, score] = useSelector(getQuizScore(quizId))
    const status = useSelector(getQuizStatus(quizId))
    const quizName = useSelector(getQuizName(quizId))

    const [value, setValue] = useState("")
    const [disableNext, setDisableNext] = useState(true)
    const [message, setMessage] = useState("")

    const handleOptionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedOptionId = event.target.value || ""

        setValue(selectedOptionId)

        const isCorrect = await answerQuestion({ questionId: questionId || "", optionId: selectedOptionId})

        if (!isCorrect) {
            setMessage("Wrong answer")
        } else {
            setMessage("Correct!")

        }

        setDisableNext(false)
    };

    const handleNextQuestion = async() => {
       setMessage("")
       setDisableNext(true)
       await dispatch(nextQuestionAction({quizId}))
    }

    const handleFinishQuiz = () => {
        navigate("/quizzes")
    }

    if (status === "COMPLETED") {
        return (
            <Container>
                <Box sx={{ mb: 2}}>
                    <Typography variant="h4">
                        End of the Quiz. Thank you for playing with us.
                    </Typography>
                </Box>
                <Typography variant="h5">
                    {`Your score is: ${score}/${totalQuestions}`}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
                    <Button variant="contained" onClick={handleFinishQuiz}>Finish</Button>
                </Box>
            </Container>
        )
    }

    return (
        <Container>
            <Box>
                <Box sx={{ display: "flex"}}>
                    <BackButton />
                </Box>
                <Header title={quizName} />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column"}}>
               <Box>
                   <FormControl component="fieldset">
                       <Typography variant="h5">
                           {questionName}
                       </Typography>
                       <Typography variant="h6">
                           {questionDescription}
                       </Typography>
                       <RadioGroup aria-label="options" value={value} onChange={handleOptionChange}>
                           {options.map((option: IOption) => {
                               return (
                                   <FormControlLabel
                                       disabled={!disableNext}
                                       key={option._id}
                                       value={option._id}
                                       control={<Radio color="default" />}
                                       label={option.name}
                                   />
                               );
                           })}
                       </RadioGroup>
                   </FormControl>
               </Box>

                <Box>
                    <Typography variant="h6">{message}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
                    <Button disabled={disableNext} variant="contained" onClick={handleNextQuestion}>Next</Button>
                </Box>
            </Box>
        </Container>
    );
};

export default PlayQuiz;
