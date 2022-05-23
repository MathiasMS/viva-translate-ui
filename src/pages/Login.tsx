import React, {ChangeEvent, useEffect, useState} from "react";
import { useLogin } from "../features/authentication/useLogin";
import {useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "../components/Copyright";
import {useSelector} from "react-redux";
import {RootState} from "../app/store";

const Login = () => {
    const { login } = useLogin();
    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { isLogged } = useSelector((state: RootState) => state.authentication);

    const handleChangeUsername = (e: { target: { value: React.SetStateAction<string> } }) =>
        setUsername(e.target.value);

    const handleChangePassword = (e: { target: { value: React.SetStateAction<string> } }) =>
        setPassword(e.target.value);

    const handleChangeRememberMe = (event: ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    };

    const handleSubmit = async() => {
        return login({ username, password }, rememberMe );
    };

    useEffect(() => {
        if(isLogged){
            navigate('/quizzes')
        }

    }, [])

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
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
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
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                        <Typography variant="subtitle2">Remember me</Typography>
                        <Checkbox
                            checked={rememberMe}
                            onChange={handleChangeRememberMe}
                        />
                    </Box>
                    <Button type="button" onClick={handleSubmit} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
};

export default Login;
