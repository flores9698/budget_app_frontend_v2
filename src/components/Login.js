import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Formik } from "formik";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://34.71.211.145:8500";

function Register() {
  const [username, setUsername] = React.useState("toby9698@gmail.com");
  const [password, setPassword] = React.useState("12345");
  const [loggedIn, setLoggedIn] = React.useState(false);
  let userInfo = {};
  const [error, setError] = React.useState("");

  let navigate = useNavigate();
  const cookiesOptions = { expires: new Date(Date.now() + 3600 * 1000) };

  return (
    <div className={"vh-100"}>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values) => {
          //console.log(values);
          axios
            .post(`${baseUrl}/users/login`, {
              email: values.email,
              password: values.password,
            })
            .then((res) => {
              // setUserInfo(res);
              setLoggedIn(true);
              userInfo = res.data.body.user;
              //console.log(userInfo);
              //console.log(res.data.body.user.token);
              const cookies = new Cookies();
              cookies.set("token", res.data.body.user.token, cookiesOptions);
              cookies.set("userid", res.data.body.user.id, cookiesOptions);
              cookies.set(
                "userFirstName",
                res.data.body.user.name,
                cookiesOptions
              );

              //wait 2 seconds to redirect
              setTimeout(() => {
                //console.log(userInfo);
                navigate("/welcome");
              }, 2000);
            })

            .catch((err) => {
              //console.log(err);
              setError(err.response.data.error);
            });
        }}
        validate={(values) => {
          const errors = {};

          if (!values.email) {
            errors.email = "Required";
          }
          if (!values.password) {
            errors.password = "Required";
          }

          return errors;

          //TODO: check if email is valid and set error if incorrect password
        }}
      >
        {({ values, errors, handleSubmit, handleChange, handleBlur }) => (
          <div className={"container bg-gradient my-5"}>
            <div className={"container-fluid w-50 h-75"}>
              <div className={"h3 mt-5"}>Login</div>
              <Form className={"mt-5 rounded "} onSubmit={handleSubmit}>
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
                    <div className="alert-danger">{errors.email}</div>
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
                    <div className="alert-danger">{errors.password}</div>
                  )}
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="align-items-center "
                >
                  Login
                </Button>
                <div>
                  <Form.Text>
                    Not Registered? <a href="/register">Register</a>
                  </Form.Text>
                </div>
              </Form>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default Register;
