import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Cookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddCategoryDialog from "./dialogs/AddCategoryDialog";
import AddExpenseDialog from "./dialogs/AddExpenseDialog";
import Table from './Table';
// import {Table} from 'react-bootstrap';
const cookies = new Cookies();
const cookiesOptions = { expires: new Date(Date.now() + 3600 * 1000) };
const userId = cookies.get("userid");
const token = cookies.get("token");
const baseUrl = "http://34.71.211.145:8500";

export default function ExpensesDashboard() {
  const [categories, setCategories] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  const [order, setOrder] = React.useState("ASC");

  

  const getCategories = async () => {
    const response = await fetch(`${baseUrl}/categories/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data.body);
    setCategories(data.body.categories.categories);
  };

  const getExpenses = async () => {
    const response = await axios.get(`${baseUrl}/expenses/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let data = await response.data.body.expenses;
    // remove T from date_added
    data.forEach((expense) => {
      expense.date_added = expense.date_added.split("T")[0];
    });
    data.forEach((expense) => {
      console.log('--->',expense.is_expense);
      expense.is_expense = expense.is_expense ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;
    });

    setExpenses(data);
  };

  const getBankAccounts = async () => {
    const response = await axios.get(`${baseUrl}/bank_accounts/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    // console.log("bank accounts", data);
  }

  useEffect(() => {
    getBankAccounts();
  }, []);
    



  useEffect(() => {
    getExpenses();
    console.log("Expenses", expenses);
  }, []);



  const columns = [{
    Header: "Description",
    accessor: "expense_name",
  }, {
    Header: "Category",
    accessor: "category_name",
  },
  {
    Header: "Account Name",
    accessor: "account_name",
  },
  {
    Header: "Amount",
    accessor: "amount",
  }, {
    Header: "Date",
    accessor: "date_added",
  },
  { Header: "Expense/Income",
    accessor: "is_expense", 
  }]
  ;




  return (
    <div className={"container bg-gradient my-5"}>
      <div className={"container-fluid"}>
        <Typography variant={"h4"}>Expenses</Typography>
        <Divider />

        <Typography variant={"h3"} mt={10}>
          Last Expenses
        </Typography>


        
        
        <Table data={expenses} columns={columns}  />
        


        <AddCategoryDialog />
        <AddExpenseDialog />
      </div>
    </div>
  );
}
