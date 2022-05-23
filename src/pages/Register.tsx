import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import { useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../components/Copyright";
import { toast } from 'react-toastify';
import { useRegisterMutation } from "../features/authentication/authentication.service";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerMutation] = useRegisterMutation();
    const navigate = useNavigate()

    const handleChangeUsername = (e: { target: { value: React.SetStateAction<string> } }) =>
        setUsername(e.target.value);
    const handleChangePassword = (e: { target: { value: React.SetStateAction<string> } }) =>
        setPassword(e.target.value);

    const handleSubmit = async() => {
        const response = await registerMutation({ username, password }).unwrap();

        if(response) {
            toast.success("Account created successfully!")
            navigate('/login')
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <HowToRegIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={username}
                        onChange={handleChangeUsername}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        value={password}
                        onChange={handleChangePassword}
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button type="button" onClick={handleSubmit} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Register
                    </Button>
                </Box>
                <Grid container>
                    <Grid item>
                        <Link href="/login" variant="body2">
                           Have an account? Login
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
};

export default Register;
