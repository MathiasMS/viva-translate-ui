import React, {SetStateAction, useState} from 'react';
import { Box, Button, DialogActions, styled } from '@mui/material';
import TextField from '@mui/material/TextField';

const StyledContainer = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const CreateQuizModal = ({
    onQuizCreation,
}: {
    onQuizCreation: ({ name, description }: { name: string; description: string }) => void;
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleChangeName = (e: { target: { value: SetStateAction<string> } }) => setName(e.target.value);

    const handleChangeDescription = (e: { target: { value: SetStateAction<string> } }) =>
        setDescription(e.target.value);

    const handleCreateQuiz = () => {
        onQuizCreation({ name, description });
    };

    return (
        <StyledContainer>
            <Box>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="name"
                    label="Name"
                    type="name"
                    value={name}
                    onChange={handleChangeName}
                    id="name"
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="description"
                    label="Description"
                    type="description"
                    value={description}
                    onChange={handleChangeDescription}
                    id="description"
                />
            </Box>
            <DialogActions>
                <Button variant="contained" onClick={handleCreateQuiz}>
                    Create
                </Button>
            </DialogActions>
        </StyledContainer>
    );
};

export default CreateQuizModal;
