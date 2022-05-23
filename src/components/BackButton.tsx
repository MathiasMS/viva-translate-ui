import React from 'react'
import {useNavigate } from 'react-router-dom';
import {Button} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Generic Go Back Button
const BackButton = () => {
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-1)
    }
    return <Button variant="text" startIcon={<ArrowBackIcon />} onClick={goBack}>Back</Button>
}

export default BackButton
