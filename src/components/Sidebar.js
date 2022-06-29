import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AccountBalanceSharpIcon from '@mui/icons-material/AccountBalanceSharp';
import {Cookies} from "react-cookie";
import {Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import {TableBody, TableCell, TableHead, TableRow, Table, TableContainer, Button} from "@mui/material";
import {Routes, Route, Outlet} from "react-router-dom";
import AddAccountDialog from "./dialogs/AddAccountDialog";
import ExpensesDashboard from "./ExpensesDashboard";
import AccountTable from "./AccountTable";

const drawerWidth = 240;
const cookies = new Cookies();
const cookiesOptions = {expires: new Date(Date.now() + 3600 * 1000)}
const baseUrl = 'http://192.168.0.14:8500';

export default function Sidebar() {
    const [userInfo, setUserInfo] = React.useState({});
    const [bankAccounts, setBankAccounts] = React.useState([]);

    const authToken = cookies.get("token");
    const userId = cookies.get("userid");

    const getBankAccounts = async () => {
        const response = await fetch(
            `${baseUrl}/bank_accounts/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`
                },
            }
        );
        const data = await response.json();
        setBankAccounts(data.body.user)
        // cookies.set("bankAccounts", data.body.user, cookiesOptions);
    };
    React.useEffect(() => {
        getBankAccounts();
        console.log(bankAccounts);

    }, []);


    const navigate = useNavigate();
    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                // position="fixed"
                sx={{width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`,}}
            >
                <Toolbar>

                    <ListItemButton onClick={() => {
                        console.log("logout");
                        cookies.remove("token");
                        cookies.remove("userid");
                        navigate("/login");


                    }}>
                        <ListItemText primary={"Logout"}/>

                    </ListItemButton>
                </Toolbar>

            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    color: '#1b77d2',
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar sx={{
                    backgroundColor: '#1b77d2',
                    color: '#fff',
                }}>
                    <Typography variant="h6">
                        My Budget App
                    </Typography>
                </Toolbar>
                <Divider/>
                <List mt={3}>
                    {
                        ['Expenses', 'Accounts'].map((element) => (
                            <ListItem key={element} disablePadding>
                                <AccountBalanceSharpIcon/>
                                <ListItemButton sx={{
                                    textDecoration: 'none',
                                }} >
                                    <Link to={`${element.toLowerCase()}`} >
                                        <ListItemText primary={element}/>
                                    </Link>
                                </ListItemButton>
                            </ListItem>

                        ))}
                    <Divider/>
                </List>

            </Drawer>
            <Box
                component="main"
                sx={{flexGrow: 1, bgcolor: 'background.default ', p: 3}}
            >


                {/*<Box mt={8}>*/}
                {/*    <AccountTable/>*/}
                {/*</Box>*/}

                {/*<Box mt={10}>*/}
                {/*    <ExpensesDashboard/>*/}

                {/*</Box>*/}
                <Outlet/>

            </Box>
        </Box>
    );
}
