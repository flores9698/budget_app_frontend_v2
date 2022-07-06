import React from "react";
import { Formik } from "formik";
import { useState } from "react";
import { Cookies } from "react-cookie";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router";

const cookies = new Cookies();
// const cookiesOptions = { expires: new Date(Date.now() + 3600 * 1000) };
const authToken = cookies.get("token");
const userId = cookies.get("userid");
const baseUrl = "http://34.71.211.145:8500";

export default function Transfer(props) {
  const navigate = useNavigate();
  const [from_account, setFromAccount] = useState("");
  const [to_account, setToAccount] = useState("");
  const [amount, setAmount] = useState(0);
  const [bankAccounts, setBankAccounts] = useState([]);

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
    <div style={{ marginTop: "10px" }}>
      <h3>Transfer</h3>
      <Formik
        initialValues={{ from_account: "", to_account: "", amount: 0 }}
        onSubmit={(values) => {
          console.log(values);
          axios.post(
            `${baseUrl}/bank_accounts/transfer`,
            {
              from_account: values.from_account,
              to_account: values.to_account,
              amount: values.amount,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          axios.post(
            `${baseUrl}/expenses`,
            {
              expense_name: "Transfer",
              user_id: userId,
              date_added: new Date(),
              category_id: 15,
              amount: values.amount,
              bank_account_id: values.to_account,
              income: "true",
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          axios.post(
            `${baseUrl}/expenses`,
            {
              expense_name: "Transfer",
              user_id: userId,
              date_added: new Date(),
              category_id: 19,
              amount: values.amount,
              bank_account_id: values.from_account,
              income: "false",
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          console.log("Transfer successful");
          navigate("/welcome/expenses");
        }}
      >
        {({ values, handleChange, handleSubmit, handleBlur }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicAccountFrom">
              <Form.Label className="h5">From Account</Form.Label>
              <Form.Select
                name="from_account"
                onChange={handleChange}
                value={values.from_account}
              >
                <option value="">Select Account</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formBasicAccountTo">
              <Form.Label className="h5">To Account</Form.Label>
              <Form.Select
                name="to_account"
                onChange={handleChange}
                value={values.to_account}
              >
                <option value="">Select Account</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formBasicAmount">
              <Form.Label className="h5">Amount</Form.Label>
              <Form.Control
                name="amount"
                onChange={handleChange}
                value={values.amount}
                onBlur={handleBlur}
              />
            </Form.Group>
            <Form.Group controlId="formBasicSubmit">
              <Button
                variant="primary"
                type="submit"
                className="align-items-center "
                style={{ marginTop: "10px" }}
              >
                Transfer
              </Button>
            </Form.Group>
          </Form>
        )}
      </Formik>
    </div>
  );
}
