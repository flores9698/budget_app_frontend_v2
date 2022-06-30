import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Cookies } from "react-cookie";
import { Formik } from "formik";
import { FormControl, FormLabel } from "react-bootstrap";
import { useEffect } from "react";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";

const baseUrl = "http://34.67.5.157:8500";
const cookies = new Cookies();

const userId = cookies.get("userid");
const token = cookies.get("token");

export default function AddAccountDialog() {
  const [open, setOpen] = React.useState(false);
  const [accountName, setAccountName] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [balance, setBalance] = React.useState(0);
  const [banks, setBanks] = React.useState([]);
  const errors = {};

  const getBanks = async () => {
    const response = await fetch(`${baseUrl}/banks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data.body);
    setBanks(data.body.bank_accounts);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseCancel = () => {
    setOpen(false);
  };

  const validateBalance = (values) => {
    if (values < 0) {
      errors.balance = "Balance must be greater than 0";
    }
    //check if its a number
    else if (isNaN(values)) {
      errors.balance = "Balance must be a number";
    }
  };
  const handleDialogClose = () => {
    axios
      .post(
        `${baseUrl}/bank_accounts`,
        {
          user_id: userId,
          name: accountName,
          bank_id: bankName,
          balance: balance,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setOpen(false);
        //    reload page
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getBanks();
  }, []);
  const onChangeBalance = (e) => {
    validateBalance(e.target.value);
    if (e.target.value < 0) {
      setBalance();
    }

    setBalance(e.target.value);
  };

  return (
    <Box mt={2}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Account
      </Button>
      <Dialog open={open} onClose={handleCloseCancel}>
        <DialogTitle>Add Account </DialogTitle>
        <Form
          style={{
            margin: "auto",
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Form.Group className={"form-group"}>
            <FormLabel htmlFor="accountName">Account Name</FormLabel>
            <FormControl
              type="text"
              className={"form-control"}
              id="accountName"
              placeholder="Enter Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className={"form-group"}>
            <FormLabel htmlFor="bankName">Bank Name</FormLabel>
            <Select
              labelId={"bankName"}
              id={"bankName"}
              // value={"Bac"}
              label={"Bank Name"}
              onChange={(e) => setBankName(e.target.value)}
              sx={{
                height: "40px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f8f9fa",
              }}
            >
              {banks.map((bank) => (
                <MenuItem key={bank.bank_id} value={bank.bank_id}>
                  {bank.bank_name}
                </MenuItem>
              ))}
            </Select>
          </Form.Group>
          <Form.Group className={"form-group"}>
            <FormLabel htmlFor="accountBalance">Balance</FormLabel>
            <FormControl
              type="number"
              className={"form-control"}
              id="accountBalance"
              placeholder="Enter Account Balance"
              value={balance}
              onChange={onChangeBalance}
            />
            {errors.balance && (
              <div className={"text-danger"}>{errors.balance}</div>
            )}
          </Form.Group>
        </Form>

        <DialogActions>
          <Button onClick={handleCloseCancel}>Cancel</Button>
          <Button onClick={handleDialogClose}>Add Account</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
