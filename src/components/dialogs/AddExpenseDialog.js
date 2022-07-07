import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Form from "react-bootstrap/Form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import { Cookies } from "react-cookie";
import { Formik } from "formik";
import { FormControl, FormLabel } from "react-bootstrap";
import { useEffect } from "react";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import AddCategoryDialog from "./AddCategoryDialog";

const baseUrl = "http://34.71.211.145:8500";
const cookies = new Cookies();

const userId = cookies.get("userid");
const token = cookies.get("token");

export default function AddExpenseDialog() {
  const [open, setOpen] = React.useState(false);
  const [expenseName, setExpenseName] = React.useState("");
  const [date, setDate] = React.useState("");
  const [category, setCategory] = React.useState([]);
  const [amount, setAmount] = React.useState("");
  const [bankName, setBankName] = React.useState("");
  const [banks, setBanks] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [isIncome, setIsIncome] = React.useState(false);

  const errors = {};

  const isIncomeChange = (e) => {
    setIsIncome(e.target.checked)
    console.log(!isIncome);
  };

  const getBanks = async () => {
    const response = await fetch(`${baseUrl}/bank_accounts/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data.body);
    setBanks(data.body.user);
  };
  const updateBalance = async() => {
    let postUrl = `${baseUrl}/bank_accounts/balance/${bankName}`;
    axios.post(postUrl,
    {
      balance : amount,
      is_expense : !isIncome,
    }
    ,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }
  
  const getCategories = async () => {
    const response = await fetch(`${baseUrl}/categories/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setCategories(data.body.categories);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseCancel = () => {
    setOpen(false);
  };

  const handleDialogClose = () => {
    axios
      .post(
        `${baseUrl}/expenses`,
        {
          expense_name: expenseName,
          user_id: userId,
          date_added: date,
          category_id: category,
          amount: amount,
          bank_account_id: bankName,
          income: isIncome,
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
        updateBalance();
        //    reload page
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
    console.log("expenseName", expenseName);
    console.log("date", date);
    console.log("category", category);
    console.log("amount", amount);
    console.log("bankName", bankName);
    console.log("userId", userId);
    console.log("Is Income", isIncome.toString());
  };
  useEffect(() => {
    getBanks();
    console.log("-------Banks", banks);
    // getCategories();
    // console.log("categories", categories);
  }, []);

  useEffect(() => {
    // getBanks();
    // console.log("banks", banks);
    getCategories();
    console.log("categories", categories);
  }, []);

  return (
    <Box mt={2}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Expense
      </Button>
      <Dialog open={open} onClose={handleCloseCancel}>
        <DialogTitle>Add Expense </DialogTitle>
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
            <FormLabel htmlFor="expenseName">Expense Name</FormLabel>
            <FormControl
              type="text"
              className={"form-control"}
              id="expenseName"
              placeholder="Enter Expense Name"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className={"form-group"}>
            <FormLabel htmlFor="bankName">Bank Account Name</FormLabel>
            <Select
              labelId={"bankName"}
              id={"bankName"}
              value={bankName}
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
                <MenuItem key={bank.id} value={bank.id}>
                  {bank.account_name}
                </MenuItem>
              ))}
            </Select>
          </Form.Group>

          <Form.Group className={"form-group"}>
            <FormLabel htmlFor="expenseDate">Expense Date</FormLabel>
            <FormControl
              type="date"
              className={"form-control"}
              id="expenseDate"
              placeholder="Enter Expense Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group className={"form-group"}>
            <FormLabel htmlFor="expenseCategory">Expense Category</FormLabel>
            <Select
              labelId={"expenseCategory"}
              id={"expenseCategory"}
              value={category}
              label={"Expense Category"}
              onChange={(e) => setCategory(e.target.value)}
              sx={{
                height: "40px",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f8f9fa",
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </Form.Group>

          <Form.Group className={"form-group"}>
            <FormLabel htmlFor="expenseAmount">Expense Amount</FormLabel>
            <FormControl
              type="number"
              className={"form-control"}
              id="expenseAmount"
              placeholder="Enter Expense Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isIncome}
                  onChange={(e) => setIsIncome(e.target.checked)}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Income"
            />
          </Form.Group>
          <AddCategoryDialog />
        </Form>

        <DialogActions>
          <Button onClick={handleCloseCancel}>Cancel</Button>
          <Button onClick={handleDialogClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
