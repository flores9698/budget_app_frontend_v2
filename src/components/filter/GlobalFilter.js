import { Box, TextField } from "@mui/material";
import React from "react";


const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <Box
        
        component="div"
        sx={{
            marginTop: "1rem",
            marginBottom: "1rem",
            height: "3rem",
            width: "100%",
            display: "flex",
        }}

        >
        Filter:{''}
        <TextField
        id="outlined-basic" label="Search" variant="outlined"  
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value || undefined)}
        placeholder="Search"
        />
        </Box>
    );
}


export default GlobalFilter;