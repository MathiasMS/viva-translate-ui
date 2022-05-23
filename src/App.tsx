import React from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./App.css";
import AppRouter from "./app/AppRouter";
import NavBar from "./components/NavBar";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter} from "react-router-dom";


function App() {
    return (
            <Provider store={store}>
                <div className="App">
                    <BrowserRouter>
                        <NavBar />
                        <AppRouter />
                        <ToastContainer theme="colored" />
                    </BrowserRouter>
                </div>
            </Provider>
    );
}

export default App;
