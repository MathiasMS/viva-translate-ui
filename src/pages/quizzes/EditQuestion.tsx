import React, {useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useGetOneQuizByIdQuery, useUpdateQuizMutation,} from '../../features/manageQuiz/quiz.service';
import {Alert, Container, styled, Typography} from '@mui/material';
import Header from '../../components/Header';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {DataGrid, GridCellEditStopParams, GridCellEditStopReasons, GridColDef} from '@mui/x-data-grid';
import {toast} from 'react-toastify';
import {notifyErrors} from '../../utils/error';
import Modal from '../../components/Modal';
import {IOption, IQuestion, OptionId} from '../../entities/Question/interfaces';
import CreateOptionModal from "../../components/modals/CreateOptionModal";
import BackButton from "../../components/BackButton";

const StyledSubHeaderContainer = styled(Box)`
    display: flex;
    gap: 20px;
    align-items: center;
`;

//Action Button:
// Remove => remove option
const ActionButtons = ({
   handleRemove,
}: {
    handleRemove: (e: { stopPropagation: () => void }) => void;
}) => (
    <Box sx={{ display: 'flex', alignItems: "center" }}>
        <Box>
            <IconButton aria-label="delete" onClick={handleRemove}>
            <DeleteIcon fontSize="inherit" color="error" />
                </IconButton>
        </Box>
    </Box>
);

const EditQuestion = () => {
    const params = useParams();
    const { quizId, questionId } = params;

    const [open, setOpen] = useState(false);
    const [updateQuiz] = useUpdateQuizMutation();

    const { data: quiz, isLoading: quizLoading, refetch } = useGetOneQuizByIdQuery(quizId);

    const handleOpen = () => {
        setOpen(true);
    };

    // Get the question by id
    const question = useMemo(() => {
        if (quiz) {
            return quiz.questions.find((question: IQuestion) => question._id === questionId)
        }
        return
    }, [quiz])

    // Map, parse and memo the options to use as rows in our table
    const rows = useMemo(() => {
        return question ? question.options.map((option: IOption) => ({
                id: option._id,
                name: option.name,
                isCorrect: option.isCorrect,
            })) : []
    }, [quiz]);

    // Define columns to show our options
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 400, sortable: false, editable: true },
        { field: 'isCorrect', headerName: 'Correct Answer', width: 120, sortable: false, editable: true,  type: 'singleSelect', valueOptions: ['No', 'Yes'],
            valueGetter: (params) => {
                return params.value ? "Yes" : "No"
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 400,
            renderCell: (params) => {
                // Remove the option
                const handleRemove = (e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    handleRemoveOption(params.id as OptionId)
                };

                return <ActionButtons handleRemove={handleRemove} />
            },
        },
    ];

    // Remove the option
    const handleRemoveOption = async (optionId: OptionId) => {
        try {
            if(quiz && question){

                // Get the current questions (we need to update one option of one of this question)
                const questionsForUpdate = [...quiz.questions]

                const indexOfQuestion = questionsForUpdate.findIndex(q => q._id === question._id)

                if(indexOfQuestion !== -1){
                    // The question we need to update
                    const questionForUpdate = {...questionsForUpdate[indexOfQuestion] }

                    // We get the options of this question
                    const options = [...questionForUpdate.options]

                    // We remove the option we want to remove
                    questionForUpdate.options = options.filter(o => o._id !== optionId)

                    // We update the question without the option we removed
                    questionsForUpdate[indexOfQuestion] = questionForUpdate

                    const updatedQuiz = {
                        ...quiz,
                        questions: questionsForUpdate
                    }

                    const response = await updateQuiz(updatedQuiz).unwrap();

                    if (response) {
                        refetch();
                        toast.success('Quiz removed successfully!');
                    }
                }
            }
        } catch (error: any) {
            const { data } = error;
            notifyErrors(data);
        }
    };

    const handleCreateOption = async ({ name, isCorrect }: { name: string; isCorrect: boolean }) => {
        try {
            if(quiz && question) {

                const questionsForUpdate = [...quiz.questions]

                const indexOfQuestion = questionsForUpdate.findIndex(q => q._id === question._id)

                if(indexOfQuestion !== -1){
                    const newOption: IOption = {
                        name,
                        isCorrect,
                    };

                    const questionForUpdate = {...questionsForUpdate[indexOfQuestion] }

                    const options = [...questionForUpdate.options]

                    options.push(newOption)

                    questionForUpdate.options = options
                    questionsForUpdate[indexOfQuestion] = questionForUpdate

                    const quizForUpdate = {
                        ...quiz,
                        questions: questionsForUpdate
                    }

                    const response = await updateQuiz(quizForUpdate).unwrap();

                    if (response) {
                        refetch();
                        setOpen(false);
                        toast.success('Option created successfully!');
                    }
                }
            }

        } catch (error: any) {
            console.log(error)
            const { data } = error;
            notifyErrors(data);
        }
    };

    const handleEditOption = async (params: GridCellEditStopParams, event: any) => {
        if (quiz && quiz.questions.length && params.reason === GridCellEditStopReasons.enterKeyDown) {
            const {
                row: { id },
                field,
            } = params;

            const newValue = event.target.value || event.target.innerHTML;

            const questionsForUpdate = [...quiz.questions]

            const indexOfQuestion = questionsForUpdate.findIndex(q => q._id === question?._id)

            const questionForUpdate = {...questionsForUpdate[indexOfQuestion] }

            const options = [...questionForUpdate.options]

            const optionToUpdateIndex = options.findIndex(o => o._id === id)

            if(optionToUpdateIndex !== -1){

                const optionToUpdate = { ...options[optionToUpdateIndex] }

                const updatedOption: IOption = {
                    ...optionToUpdate,
                    [field]: newValue === "Yes",
                }

                options[optionToUpdateIndex] = updatedOption

                questionForUpdate.options = options
                questionsForUpdate[indexOfQuestion] = questionForUpdate

                const updatedQuiz = {
                    ...quiz,
                    questions: questionsForUpdate
                }

                const response = await updateQuiz(updatedQuiz).unwrap();

                if (response) {
                    refetch();
                    toast.success('Option edited successfully!');
                }
            }
        }
    }

    const validateLengthOfOptions = useMemo(() => {
        if(question) {
            return question.options.length > 10 || question.options.length < 2
        }

    }, [question])


    return (
        <Container>
            <Box sx={{ display: "flex"}}>
                <BackButton />
            </Box>
            <Header title={question ? question.name : ""} actionLabel="Create Option" action={handleOpen} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <StyledSubHeaderContainer>
                    <Typography variant="subtitle1">Description:</Typography>
                    <Typography variant="subtitle2">{question ? question.description : ""}</Typography>
                </StyledSubHeaderContainer>
            </Box>
            <Box sx={{ height: 300, width: '100%', mt: 2}}>
                <Modal
                    open={open}
                    setOpen={setOpen}
                    title="Create Option"
                    content={<CreateOptionModal onOptionCreation={handleCreateOption} />}
                />
                {
                    validateLengthOfOptions && (
                    <Box>
                        <Alert severity="error">Remember: For use this question it will need to have at least 2 options and no more than 10. If not, they question will not appear in the Quiz</Alert>
                    </Box>)
                }
                <DataGrid
                    rows={rows}
                    loading={quizLoading}
                    columns={columns}
                    hideFooterPagination
                    disableColumnMenu
                    experimentalFeatures={{ newEditingApi: true }}
                    disableColumnFilter
                    onCellEditStop={handleEditOption}
                    disableColumnSelector
                    disableSelectionOnClick
                    pagination
                    autoHeight
                />
            </Box>
        </Container>
    );
};

export default EditQuestion;
