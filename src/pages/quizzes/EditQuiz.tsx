import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useGetOneQuizByIdQuery,
    useUpdateQuizMutation,
} from '../../features/manageQuiz/quiz.service';
import {Alert, Button, Container, styled, Typography} from '@mui/material';
import Header from '../../components/Header';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {DataGrid, GridCellEditStopParams, GridCellEditStopReasons, GridCellParams, GridColDef} from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { notifyErrors } from '../../utils/error';
import Modal from '../../components/Modal';
import { IQuestion } from '../../entities/Question/interfaces';
import CreateQuestionModal from "../../components/modals/CreateQuestionModal";
import BackButton from "../../components/BackButton";

const StyledSubHeaderContainer = styled(Box)`
    display: flex;
    gap: 20px;
    align-items: center;
`;

//Action Button:
// Edit Options => go to question edit page
const ActionButtons = ({
    handleRemove,
    handleEdit,
}: {
    handleEdit: (e: { stopPropagation: () => void }) => void;
    handleRemove: (e: { stopPropagation: () => void }) => void;
}) => (
    <Box sx={{ display: 'flex', alignItems: "center" }}>
        <Box sx={{ mr: 1 }}>
            <Button variant="contained" onClick={handleEdit}>
                Edit Options
            </Button>
        </Box>
        <Box>
            <IconButton aria-label="delete" onClick={handleRemove}>
                <DeleteIcon fontSize="inherit" color="error" />
            </IconButton>
        </Box>
    </Box>
);

const EditQuiz = () => {
    const params = useParams();
    const { quizId } = params;

    const [open, setOpen] = useState(false);
    const [updateQuiz] = useUpdateQuizMutation();
    const navigate = useNavigate();

    const { data: quiz, isLoading: quizLoading, refetch } = useGetOneQuizByIdQuery(quizId);

    const handleOpen = () => {
        setOpen(true);
    };

    // Method to create a new question
    const handleCreateQuestion = async ({ name, description }: { name: string; description: string }) => {
        try {
            const newQuestion: IQuestion = {
                name,
                description,
                options: []
            };

            if(quiz) {
                const quizForUpdate = {
                    ...quiz,
                    questions: [...quiz.questions, newQuestion]
                }
                const response = await updateQuiz(quizForUpdate).unwrap();

                if (response) {
                    refetch();
                    setOpen(false);
                    toast.success('Question created successfully!');
                }
            }

        } catch (error: any) {
            const { data } = error;
            notifyErrors(data);
        }
    };

    // Map, parse and memo the questions to use as rows in our table
    const rows = useMemo(() => {
        return quiz
            ? quiz.questions.map((question: IQuestion) => ({
                  id: question._id,
                  name: question.name,
                  description: question.description,
                  optionsQty: question.options.length
              }))
            : [];
    }, [quiz]);

    // Define columns to show our questions
    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 400, sortable: false, editable: true },
        { field: 'description', headerName: 'Description', width: 400, sortable: false, editable: true },
        { field: 'optionsQty', headerName: 'Options', width: 120, sortable: false },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 400,
            renderCell: (params) => {

                //Edit => go to edit manageQuiz page
                const handleEdit = (e: { stopPropagation: () => void }) => {
                    navigate(`${params.id}`);
                    e.stopPropagation();
                };

                //Remove => remove a manageQuiz
                const handleRemove = async (e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    try {
                        if(quiz){

                        const quizForRemoveQuestion = {
                            ...quiz,
                            questions: quiz.questions.filter((question: IQuestion) => question._id !== params.id)
                        }

                        const response = await updateQuiz(quizForRemoveQuestion).unwrap();

                        if (response) {
                            refetch();
                            toast.success('Quiz removed successfully!');
                        }

                        }
                    } catch (error: any) {
                        const { data } = error;
                        notifyErrors(data);
                    }
                };

                return (
                    <ActionButtons
                        handleEdit={handleEdit}
                        handleRemove={handleRemove}
                    />
                );
            },
        },
    ];

    const handleEditQuiz = async (params: GridCellEditStopParams, event: any) => {
        if (quiz && quiz.questions.length && params.reason === GridCellEditStopReasons.enterKeyDown) {
            const {
                row: { id },
                field,
            } = params;

            const newValue = event.target.value;

            const questionsForUpdate = [...quiz.questions];

            const questionForUpdateIndex = questionsForUpdate.findIndex((question: IQuestion) => question._id === id)

            const questionForUpdate = { ...questionsForUpdate[questionForUpdateIndex] }

            const updatedQuestion: IQuestion = {
                ...questionForUpdate,
                [field]:  newValue
            }

            questionsForUpdate[questionForUpdateIndex] = updatedQuestion

            const updatedQuiz = {
                ...quiz,
                questions: questionsForUpdate
            }

            const response = await updateQuiz(updatedQuiz).unwrap();

            if (response) {
                refetch();
                toast.success('Question edited successfully!');
            }
        }
    }

    // Cannot play a manageQuiz without questions, so we use this to show the error message and
    // to disable the play button if the manageQuiz has not any question
    const questionOptionErrorMessage = useMemo(() => {
        return rows.some(r => r.optionsQty < 2 || r.optionsQty > 10)
    }, [rows]);

    return (
        <Container>
            <Box sx={{ display: "flex"}}>
                <BackButton />
            </Box>
            <Header title={quiz ? quiz.name : ""} actionLabel="Create Question" action={handleOpen} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <StyledSubHeaderContainer>
                    <Typography variant="subtitle2">{quiz ? quiz.description : ""}</Typography>
                </StyledSubHeaderContainer>
            </Box>
            <Box sx={{ height: 300, width: '100%', mt: 2,
                '& .error': {
                    backgroundColor: '#f07d7d',
                    color: '#1a3e72',
                },
                '& .normal': {
                    backgroundColor: '#FFFFF',
                    color: '#1a3e72',
                },
            }}>
                <Modal
                    open={open}
                    setOpen={setOpen}
                    title="Create Question"
                    content={<CreateQuestionModal onQuestionCreation={handleCreateQuestion} />}
                />
                {
                    questionOptionErrorMessage && (
                        <Box sx={{ mt: 2}}>
                            <Alert severity="error">Remember: Every question needs to a minimum of 2 and a maximum of 10 options to be used</Alert>
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
                    getCellClassName={(params: GridCellParams<number>) => {
                        if (params.field === 'name' || params.field === 'description' || params.value == null) {
                            return '';
                        }

                        return params.value > 10 || params.value  < 2 ? "error" : "normal"

                    }}
                    onCellEditStop={handleEditQuiz}
                    disableColumnSelector
                    disableSelectionOnClick
                    pagination
                    autoHeight
                />
            </Box>
        </Container>
    );
};

export default EditQuiz;
