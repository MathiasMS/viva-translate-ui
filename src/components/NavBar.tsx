import React, { MouseEvent, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {useLogout} from "../features/authentication/useLogout";
import {useSelector} from "react-redux";
import {RootState} from "../app/store";
import {Typography} from "@mui/material";

const NavBar = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { user, isLogged } = useSelector((state: RootState) => state.authentication);
    const { logout } = useLogout();

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onClose = () => {
        setAnchorEl(null);
    }

    const handleLogout = async() => {
        await logout()
        onClose()
    };

    return (
        <Box sx={{ flexGrow: 1, mb: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: "end" }}>
                    {
                        isLogged && (
                            <Box>
                               <Box sx={{ display: "flex", alignItems: "center"}}>
                                   <Box sx={{ mr: 2}}>
                                       <Typography variant="subtitle1">{user ? user.username : ""}</Typography>
                                   </Box>
                                   <IconButton
                                       size="large"
                                       aria-label="account of current user"
                                       aria-controls="menu-appbar"
                                       aria-haspopup="true"
                                       onClick={handleMenu}
                                       color="inherit"
                                   >
                                       <AccountCircle />
                                   </IconButton>
                               </Box>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    onClose={onClose}
                                    open={Boolean(anchorEl)}
                                >
                                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                </Menu>
                            </Box>
                        )
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;
