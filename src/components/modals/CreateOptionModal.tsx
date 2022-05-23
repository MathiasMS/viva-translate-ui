import React, {ChangeEvent, SetStateAction, useState} from 'react';
import {Box, Button, Checkbox, DialogActions, styled, Typography} from '@mui/material';
import TextField from '@mui/material/TextField';

const StyledContainer = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const CheckBoxContainer = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const CreateOptionModal = ({
    onOptionCreation,
}: {
    onOptionCreation: ({ name, isCorrect }: { name: string; isCorrect: boolean }) => void;
}) => {
    const [name, setName] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    const handleChangeIsCorrect = (event: ChangeEvent<HTMLInputElement>) => {
        setIsCorrect(event.target.checked);
    };

    const handleChangeName = (e: { target: { value: SetStateAction<string> } }) => setName(e.target.value);

    const handleCreateQuiz = () => {
        onOptionCreation({ name, isCorrect });
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
                <CheckBoxContainer>
                    <Typography variant="subtitle2">Is the correct option?</Typography>
                    <Checkbox
                        checked={isCorrect}
                        onChange={handleChangeIsCorrect}
                    />
                </CheckBoxContainer>
            </Box>
            <DialogActions>
                <Button variant="contained" onClick={handleCreateQuiz}>
                    Create
                </Button>
            </DialogActions>
        </StyledContainer>
    );
};

export default CreateOptionModal;
