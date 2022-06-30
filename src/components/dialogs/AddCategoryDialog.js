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

const baseUrl = "http://34.71.211.145:8500";
const cookies = new Cookies();

const userId = cookies.get("userid");
const token = cookies.get("token");

export default function AddCategoryDialog() {
  const [open, setOpen] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState("");
  const errors = {};

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
    setCategoryName(data.body.categories.categories);
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
        `${baseUrl}/categories`,
        {
          user_id: userId,
          category_name: categoryName,
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
    getCategories();
    console.log("categories", categoryName);
  }, []);

  return (
    <Box mt={2}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Category
      </Button>
      <Dialog open={open} onClose={handleCloseCancel}>
        <DialogTitle>Add Category </DialogTitle>
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
            <FormLabel htmlFor="categoryName">Account Name</FormLabel>
            <FormControl
              type="text"
              className={"form-control"}
              id="categoryName"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Form.Group>
        </Form>

        <DialogActions>
          <Button onClick={handleCloseCancel}>Cancel</Button>
          <Button onClick={handleDialogClose}>Add Category</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
