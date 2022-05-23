import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Quizzes from "../pages/quizzes/Index";
import EditQuiz from "../pages/quizzes/EditQuiz";
import EditQuestion from "../pages/quizzes/EditQuestion";
import ProtectedRoute from "./ProtectedRoute";
import PlayQuiz from "../pages/quizzes/PlayQuiz";

const AppRouter = () => {
    return (
            <Routes>
                // Public Routes
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                // Protected Routes
                <Route path="/quizzes" element={
                    <ProtectedRoute>
                        <Quizzes />
                    </ProtectedRoute>
                } />

                <Route path="/quizzes/:quizId/play" element={
                    <ProtectedRoute>
                        <PlayQuiz />
                    </ProtectedRoute>
                } />

                <Route path="/quizzes/:quizId/questions" element={
                    <ProtectedRoute>
                        <EditQuiz />
                    </ProtectedRoute>
                } />

                <Route path="/quizzes/:quizId/questions/:questionId" element={
                    <ProtectedRoute>
                        <EditQuestion />
                    </ProtectedRoute>
                } />
            </Routes>
    );
};

export default AppRouter;
