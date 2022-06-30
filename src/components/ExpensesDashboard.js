import React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Cookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddCategoryDialog from "./dialogs/AddCategoryDialog";
import AddExpenseDialog from "./dialogs/AddExpenseDialog";
// import {Table} from 'react-bootstrap';
const cookies = new Cookies();
const cookiesOptions = { expires: new Date(Date.now() + 3600 * 1000) };
const userId = cookies.get("userid");
const token = cookies.get("token");
const baseUrl = "http://34.67.5.157:8500";

export default function ExpensesDashboard() {
  const [categories, setCategories] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  const [order, setOrder] = React.useState("ASC");

  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...expenses].sort((a, b) => (a[col] > b[col] ? 1 : -1));
      setExpenses(sorted);
      setOrder("DESC");
    }
    if (order === "DESC") {
      const sorted = [...expenses].sort((a, b) => (a[col] < b[col] ? -1 : 1));
      setExpenses(sorted);
      setOrder("ASC");
    }
  };

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
    setExpenses((await response).data.body.expenses);
  };
  useEffect(() => {
    getExpenses();
    console.log("Expenses", expenses);
  }, []);
  //sort expenses by column
  const sortExpenses = (column) => {
    const sortedExpenses = expenses.sort((a, b) => {
      if (a[column] < b[column]) {
        return -1;
      }
      if (a[column] > b[column]) {
        return 1;
      }
      return 0;
    });
    setExpenses(sortedExpenses);
  };

  return (
    <div className={"container bg-gradient my-5"}>
      <div className={"container-fluid"}>
        <Typography variant={"h4"}>Expenses</Typography>
        <Divider />

        <Typography variant={"h3"} mt={10}>
          Last Expenses
        </Typography>

        {/*<Table>*/}
        {/*    <TableHead>*/}
        {/*        <TableRow>*/}
        {/*            <TableCell>*/}
        {/*                Description*/}
        {/*            </TableCell>*/}
        {/*            <TableCell>*/}
        {/*                Date*/}
        {/*            </TableCell>*/}
        {/*            <TableCell>*/}
        {/*                Amount*/}
        {/*            </TableCell>*/}
        {/*            <TableCell>*/}
        {/*                Category*/}
        {/*            </TableCell>*/}
        {/*        </TableRow>*/}
        {/*    </TableHead>*/}
        {/*    <TableBody>*/}
        {/*        {expenses.map((expense) => (*/}
        {/*            <TableRow key={expense.id+expense.expense_name}>*/}
        {/*                <TableCell>*/}
        {/*                    {expense.expense_name}*/}
        {/*                </TableCell>*/}
        {/*                <TableCell>*/}
        {/*                    {expense.date_added.split("T")[0]}*/}
        {/*                </TableCell>*/}
        {/*                <TableCell>*/}
        {/*                    {expense.amount}*/}
        {/*                </TableCell>*/}
        {/*                <TableCell>*/}
        {/*                    {expense.category_name}*/}
        {/*                </TableCell>*/}
        {/*            </TableRow>*/}
        {/*        ))}*/}
        {/*    </TableBody>*/}
        {/*</Table>*/}
        <Table className={"table table-striped "}>
          <TableHead>
            <TableRow>
              <TableCell hover onClick={() => sorting("expense_name")}>
                Description
              </TableCell>
              <TableCell onClick={() => sorting("date_added")}>Date</TableCell>
              <TableCell onClick={() => sorting("amount")}>Amount</TableCell>
              <TableCell onClick={() => sorting("category_name")}>
                Category
              </TableCell>
              <TableCell align="center" onClick={() => sorting("income")}>
                Expense/Income
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id + expense.expense_name}>
                <TableCell>{expense.expense_name}</TableCell>
                <TableCell>{expense.date_added.split("T")[0]}</TableCell>
                <TableCell>
                  {
                    // add - if expense
                    expense.income ? expense.amount : expense.amount * -1
                  }
                </TableCell>
                <TableCell>{expense.category_name}</TableCell>
                <TableCell align="center">
                  {expense.income ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddCategoryDialog />
        <AddExpenseDialog />
      </div>
    </div>
  );
}
