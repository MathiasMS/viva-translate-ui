import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Copyright = (props: any) => (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {"Copyright © "}
        <Link color="inherit" href="https://vivatraduce.com/">
            Viva translate
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
    </Typography>
);

export default Copyright;
