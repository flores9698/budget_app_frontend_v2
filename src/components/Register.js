import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Formik } from "formik";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://34.71.211.145:8500";

function Register() {
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  return (
    <>
      <Formik
        initialValues={{ firstName: "", lastName: "", email: "", password: "" }}
        onSubmit={(values) => {
          axios
            .post(`${baseUrl}/users`, {
              first_name: values.firstName,
              last_name: values.lastName,
              email: values.email,
              password: values.password,
            })
            .then((res) => {
              console.log(res);
              setUserInfo(res.data);
              setTimeout(() => {
                console.log(userInfo);
                navigate("/login");
              }, 2000);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        validate={(values) => {
          const errors = {};
          if (!values.firstName) {
            errors.firstName = "Required";
          } else if (values.firstName.length < 3) {
            errors.firstName = "Must be at least 3 characters";
          }

          if (!values.lastName) {
            errors.lastName = "Required";
          }
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.password) {
            errors.password = "Required";
          } else if (values.password.length < 6) {
            errors.password = "Must be at least 6 characters";
          }
          //check for mayusculas in password
          else if (values.password.search(/[A-Z]/) === -1) {
            errors.password = "Must contain at least one uppercase letter";
          }

          return errors;
        }}
      >
        {({ values, errors, handleSubmit, handleChange, handleBlur }) => (
          <div className={"container bg-gradient my-5"}>
            <div className={"h3 mt-5"}>Register</div>
            <Form className={"mt-5 "} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={values.firstName}
                  onChange={handleChange}
                  name="firstName"
                  autoComplete="firstName"
                  // id="firstName"
                  onBlur={handleBlur}
                  placeholder="Enter first name"
                />
                {errors.firstName && (
                  <div className="alert alert-danger">{errors.firstName}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={values.lastName}
                  onChange={handleChange}
                  name="lastName"
                  autoComplete="lastName"
                  // id="lastName"
                  onBlur={handleBlur}
                  placeholder="Enter last name"
                />
                {errors.lastName && (
                  <div className="alert alert-danger">{errors.lastName}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  name="email"
                  autoComplete="email"
                  // id="email"
                  onBlur={handleBlur}
                  placeholder="Enter email"
                />
                {errors.email && (
                  <div className="alert alert-danger">{errors.email}</div>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  name="password"
                  autoComplete="password"
                  // id="password"
                  onBlur={handleBlur}
                  placeholder="Password"
                />
                {errors.password && (
                  <div className="alert alert-danger">{errors.password}</div>
                )}
              </Form.Group>
              <Button variant="primary" type="submit">
                Register
              </Button>
            </Form>
          </div>
        )}
      </Formik>
    </>
  );
}

export default Register;
