import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

import styels from "./Login.module.css";
import Input from "../UI/Input";
import Button from "../UI/Button";
import PopupError from "../LO-RE-Pages/PopupError";
import Modal from "../UI/Modal";
import useInput from "../../hooks/use-input";
import BarLoader from "../UI/BarLoader";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState({});

  // form Handling states
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isToggled = useSelector((state) => state.ui.toggleModal);

  // Test Cases for Email
  const testCasesForEmail = {
    "Enter a valid email address.": (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Email must contain the @ symbol.": (value) => value.includes("@"),
    "Spaces are not allowed in the email address. Remove any spaces.": (
      value
    ) => !/\s/.test(value) || "",
  };

  // test Cases For Password
  const testCasesForPassword = {
    "Password field cannot be left blank.": (value) => value.length !== 0,
    "Password must be at least 8 characters long.": (value) =>
      value.length >= 8,
    "Spaces are not allowed in the password. Remove any spaces.": (value) =>
      !/\s/.test(value),
  };

  // form Validation
  const {
    value: enterdEmail,
    isValid: enterdEmailIsValid,
    hasError: enterdEmailHasError,
    testCases: emailTestCases,
    valueChangeHandler: emailChangeHandler,
    valueBlurHandler: emailBlurHandler,
    reset: emailReset,
  } = useInput(testCasesForEmail);

  const {
    value: enterdPassword,
    isValid: enterdPasswordIsValid,
    hasError: enterdPasswordHasError,
    testCases: passwordTestCases,
    valueChangeHandler: passwordChangeHandler,
    valueBlurHandler: passwordBlurHandler,
    reset: passwordReset,
  } = useInput(testCasesForPassword);

  const loginHandler = async (event) => {
    event.preventDefault();

    if (enterdEmailIsValid && enterdPasswordIsValid) {
      try {
        setError({});
        setLoading(true);
        await login(enterdEmail, enterdPassword);
        navigate("/cloud/documents");

        // reset the form
        emailReset();
        passwordReset();
      } catch (error) {
        setError(error);
        dispatch(uiActions.toggleModal(true));
        console.log(error);
      }
      setLoading(false);
    } else {
      setError({
        name: "Invalid Input",
        code: "check your input",
      });
      dispatch(uiActions.toggleModal(true));
      return;
    }
  };

  if (error["name"] === "FirebaseError") {
    setError({
      name: "Invalid Credentials",
      code: "Double-check your email and password.",
    });
  }

  return (
    <main className={styels.main}>
      <h2>Welcome Back!</h2>
      {error && isToggled && (
        <Modal
          err={{
            type: "error",
            title: error["name"],
            message: error["code"],
          }}
        />
      )}
      <form onSubmit={loginHandler} className={styels.form}>
        <Input
          input={{
            id: "email",
            name: "email",
            type: "text",
            placeholder: "Email",
            value: enterdEmail,
            onChange: emailChangeHandler,
            onBlur: emailBlurHandler,
          }}
        />
        <Input
          input={{
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Password",
            value: enterdPassword,
            onChange: passwordChangeHandler,
            onBlur: passwordBlurHandler,
          }}
        />
        <div className={styels["form-actions"]}>
          {loading && (
            <div className={styels["bar-container"]}>
              <BarLoader />
            </div>
          )}
          {!loading && (
            <Button id="click-login" type="submit" className={styels.button}>
              Login
            </Button>
          )}
        </div>
        <ul
          className={styels["errors-ul"]}
          style={{
            height:
              enterdEmailHasError || enterdPasswordHasError ? "104px" : "auto",
          }}
        >
          {enterdEmailHasError &&
            emailTestCases.map((item) => (
              <PopupError key={item.testCase} message={item.testCase} />
            ))}
          {enterdPasswordHasError &&
            passwordTestCases.map((item) => (
              <PopupError key={item.testCase} message={item.testCase} />
            ))}
        </ul>
      </form>
      <p className={styels["form-action-footer"]}>
        New User?{" "}
        <Link id="nav-page-signup" to="/signup">
          Sign-Up
        </Link>
      </p>
    </main>
  );
};

export default Login;
