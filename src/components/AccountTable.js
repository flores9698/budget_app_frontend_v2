import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Cookies } from "react-cookie";
import AddAccountDialog from "./dialogs/AddAccountDialog";

const drawerWidth = 240;
const cookies = new Cookies();
const cookiesOptions = { expires: new Date(Date.now() + 3600 * 1000) };
const authToken = cookies.get("token");
const userId = cookies.get("userid");
const baseUrl = "http://34.71.211.145:8500";

const AccountTable = () => {
  const [bankAccounts, setBankAccounts] = React.useState([]);
  const getBankAccounts = async () => {
    const response = await fetch(`${baseUrl}/bank_accounts/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
    const data = await response.json();
    setBankAccounts(data.body.user);
    // cookies.set("bankAccounts", data.body.user, cookiesOptions);
  };
  React.useEffect(() => {
    getBankAccounts();
    console.log(bankAccounts);
  }, []);

  return (
    <Box mt={2}>
      <Typography variant="h4">Account's Summary</Typography>

      <Divider />

      {/*Show account info and balance on a table*/}
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Account Name</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bankAccounts.map((bankAccount) => (
              <TableRow key={bankAccount.account_id}>
                <TableCell>{bankAccount.account_name}</TableCell>
                <TableCell>{bankAccount.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddAccountDialog />
    </Box>
  );
};

export default AccountTable;
