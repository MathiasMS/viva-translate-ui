import React, { useMemo, useState } from 'react';
import {
    DataGrid,
    GridCellEditStopParams,
    GridCellEditStopReasons,
    GridCellParams,
    GridColDef,
} from '@mui/x-data-grid';
import Container from '@mui/material/Container';
import {Alert, Button} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import Box from '@mui/material/Box';
import Modal from '../../components/Modal';
import {getActiveQuizzes, QuizGameStatus} from '../../features/playQuiz/playQuiz.slice';
import { IQuizRequest, useGetPaginatedQuizzesQuery } from '../../features/manageQuiz/quiz.service';
import { IQuiz, QuizId } from '../../entities/Quiz/interfaces';
import { useNavigate } from 'react-router-dom';
import { useUpdateQuizMutation, useCreateQuizMutation, useRemoveQuizMutation } from '../../features/manageQuiz/quiz.service';
import Header from '../../components/Header';
import CreateQuizModal from '../../components/modals/CreateQuizModal';
import { toast } from 'react-toastify';
import { notifyErrors } from '../../utils/error';
import usePlayQuiz from "../../features/playQuiz/usePlayQuiz";
import {useSelector} from "react-redux";

const ActionButtons = ({
    handlePlay,
    handleResume,
    handleRemove,
    handleEdit,
    status,
    disablePlay,
}: {
    handlePlay: (e: { stopPropagation: () => void }) => void;
    handleResume: (e: { stopPropagation: () => void }) => void;
    handleEdit: (e: { stopPropagation: () => void }) => void;
    handleRemove: (e: { stopPropagation: () => void }) => void;
    status: QuizGameStatus;
    disablePlay: boolean;
}) => (
    <Box sx={{ display: 'flex', alignItems: "center" }}>
        <Box sx={{ mr: 1 }}>
            <IconButton
                aria-label="delete"
                size="small"
                disabled={disablePlay}
                onClick={status === "IN PROGRESS" ? handleResume : handlePlay}
            >
                {status === 'IN PROGRESS' ? <ReplayIcon color="secondary" /> : <PlayCircleFilledIcon color={disablePlay ? "disabled": "success" } />}
            </IconButton>
        </Box>
        <Box sx={{ mr: 1 }}>
            <Button variant="contained" onClick={handleEdit}>
                Edit Questions
            </Button>
        </Box>
        <Box>
            <IconButton aria-label="delete" onClick={handleRemove}>
                <DeleteIcon fontSize="inherit" color="error" />
            </IconButton>
        </Box>
    </Box>
);

const getStatusLabel = (status: QuizGameStatus): string => {
    const labelMap = {
        "IDLE": '',
        "IN PROGRESS": 'In progress',
        "COMPLETED": "Done!"
    }

    return labelMap[status]
}

const Quizzes = () => {
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(25);
    const [createQuizOpen, setCreateQuizOpen] = useState(false);
    const [updateQuiz] = useUpdateQuizMutation();
    const [createQuiz] = useCreateQuizMutation();
    const [removeQuiz] = useRemoveQuizMutation();
    const activeQuizzes = useSelector(getActiveQuizzes)

    const navigate = useNavigate();
    const { playQuiz } = usePlayQuiz()

    const { data: quizzes, isLoading: quizzesLoading, refetch } = useGetPaginatedQuizzesQuery({ page, limit });

    const handleCreateQuizOpen = () => {
        setCreateQuizOpen(true);
    };

    const handleOnPageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleOnPageSizeChange = (newPageSize: number) => {
        setLimit(newPageSize);
    };

    const rows = useMemo(() => {
        return quizzes
            ? quizzes.docs.map((quiz: IQuiz) => ({
                  id: quiz._id,
                  name: quiz.name,
                  description: quiz.description,
                  questionsQty: quiz.questions.length,
                  status : activeQuizzes[quiz._id] ? activeQuizzes[quiz._id].status : "IDLE"
              }))
            : [];
    }, [quizzes]);

    const questionErrorMessage = useMemo(() => {
        return rows.some(r => r.questionsQty === 0)
    }, [rows]);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 300, sortable: false, editable: true },
        { field: 'description', headerName: 'Description', width: 260, sortable: false, editable: true },
        { field: 'questionsQty', headerName: 'Questions', width: 120, sortable: false },
        { field: 'status', headerName: 'Status', width: 130, sortable: false, valueFormatter: (params) => getStatusLabel(params.value)},
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 400,
            renderCell: (params) => {
                const handlePlay = (e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    const quizToPlay = quizzes?.docs.find(q => q._id === params.id)

                    if(quizToPlay) {
                        playQuiz(quizToPlay)
                    }
                };

                const handleEdit = (e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    navigate(`${params.id}/questions`);
                };

                const handleRemove = async (e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    try {
                        const response = await removeQuiz(params.id as QuizId).unwrap();

                        if (response) {
                            refetch();
                            toast.success('Quiz removed successfully!');
                        }
                    } catch (error: any) {
                        const { data } = error;
                        notifyErrors(data);
                    }
                };

                const handleResume = (e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    navigate(`${params.id}/play`);
                };

                const status = activeQuizzes[params.id] ? activeQuizzes[params.id].status : "IDLE"

                const disablePlay = params.row.questionsQty === 0

                return (
                    <ActionButtons
                        handleResume={handleResume}
                        handlePlay={handlePlay}
                        handleEdit={handleEdit}
                        status={status}
                        disablePlay={disablePlay}
                        handleRemove={handleRemove}
                    />
                );
            },
        },
    ];

    const handleCreateQuiz = async ({ name, description }: { name: string; description: string }) => {
        try {
            const newQuiz: IQuizRequest = {
                name,
                description,
                questions: [],
            };

            const response = await createQuiz(newQuiz).unwrap();

            if (response) {
                refetch();
                setCreateQuizOpen(false);
                toast.success('Quiz created successfully!');
            }
        } catch (error: any) {
            const { data } = error;
            notifyErrors(data);
        }
    };

    const handleEditQuiz = async (params: GridCellEditStopParams, event: any) => {
        if (quizzes && params.reason === GridCellEditStopReasons.enterKeyDown) {
            const {
                row: { id },
                field,
            } = params;
            const newValue = event.target.value;

            const quizzesForUpdate = [...quizzes.docs];

            const indexQuizForUpdate = quizzesForUpdate.findIndex((quiz: IQuiz) => quiz._id == id);

            const quizForUpdate = { ...quizzesForUpdate[indexQuizForUpdate] };

            const updatedQuiz: IQuiz = {
                ...quizForUpdate,
                [field]: newValue
            }

            const response = await updateQuiz(updatedQuiz).unwrap();
            if (response) {
                refetch();
                toast.success('Quiz edited successfully!');
            }
        }
    }

    return (
        <Container>
            <Header title="Quizzes" actionLabel="Create Quiz" action={handleCreateQuizOpen} />
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
                    open={createQuizOpen}
                    setOpen={setCreateQuizOpen}
                    title="Create Quiz"
                    content={<CreateQuizModal onQuizCreation={handleCreateQuiz} />}
                />
                {
                    questionErrorMessage && (
                        <Box sx={{ mt: 2}}>
                            <Alert severity="error">Remember: Every quiz needs to have at least 1 question to be used</Alert>
                        </Box>)
                }
                <DataGrid
                    rows={rows}
                    loading={quizzesLoading}
                    columns={columns}
                    onPageChange={handleOnPageChange}
                    onPageSizeChange={handleOnPageSizeChange}
                    rowCount={quizzes ? quizzes.totalDocs : 0}
                    page={page}
                    pageSize={limit}
                    paginationMode="server"
                    disableColumnMenu
                    experimentalFeatures={{ newEditingApi: true }}
                    disableColumnFilter
                    getCellClassName={(params: GridCellParams<number>) => {
                        if (params.field === 'name' || params.field === 'description' || params.value == null) {
                            return '';
                        }

                        return params.value === 0 ? "error" : "normal"

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

export default Quizzes;
