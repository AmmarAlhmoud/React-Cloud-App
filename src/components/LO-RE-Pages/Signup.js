import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { uiActions } from "../../store/ui-slice";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../hooks/use-input";

import styels from "./Signup.module.css";
import Input from "../UI/Input";
import Button from "../UI/Button";
import PopupError from "../LO-RE-Pages/PopupError";
import Modal from "../UI/Modal";
import BarLoader from "../UI/BarLoader";

const Signup = () => {
  const { signup } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form Handling states
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
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

  // Test cases for Password
  const testCasesForPassword = {
    "Password field cannot be left blank.": (value) => value.length !== 0,
    "Password must be at least 8 characters long.": (value) =>
      value.length >= 8,
    "Include at least one uppercase letter in your password.": (value) =>
      /[A-Z]/.test(value),
    "Include at least one lowercase letter in your password.": (value) =>
      /[a-z]/.test(value),
    "Add at least one number to your password for extra security.": (value) =>
      /\d/.test(value),
    "Include at least one special character (!@#$%^&*) in your password.": (
      value
    ) => /[!@#$%^&*]/.test(value),
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

  const {
    value: enterdConfirmingPassword,
    isValid: enterdConfirmingPasswordIsValid,
    hasError: enterdConfirmingPasswordHasError,
    testCases: passwordConfirmingTestCases,
    valueChangeHandler: confirmingPasswordChangeHandler,
    valueBlurHandler: confirmingPasswordBlurHandler,
    reset: confirmingPasswordReset,
  } = useInput({
    "Two passwords does not match": (testPass) => testPass === enterdPassword,
  });

  const signupHandler = async (event) => {
    event.preventDefault();

    if (
      enterdEmailIsValid &&
      enterdPasswordIsValid &&
      enterdConfirmingPasswordIsValid
    ) {
      try {
        setError({});
        setLoading(true);
        await signup(enterdEmail, enterdPassword);
        navigate("/cloud/documents");
        // reset the form
        emailReset();
        passwordReset();
        confirmingPasswordReset();
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
      name: "Email already registered",
      code: "Please login or try a different email.",
    });
  }

  return (
    <main className={styels.main}>
      <h2>Hello, E.T.Cloud!</h2>
      {error && isToggled && (
        <Modal
          err={{ type: "error", title: error["name"], message: error["code"] }}
        />
      )}
      <form onSubmit={signupHandler} className={styels.form}>
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
        <Input
          input={{
            id: "Confirm Password",
            name: "Confirm Password",
            type: "password",
            placeholder: "Confirm Password",
            value: enterdConfirmingPassword,
            onChange: confirmingPasswordChangeHandler,
            onBlur: confirmingPasswordBlurHandler,
          }}
        />
        <div className={styels["form-actions"]}>
          {loading && (
            <div className={styels["bar-container"]}>
              <BarLoader />
            </div>
          )}
          {!loading && (
            <Button id="click-signup" type="submit" className={styels.button}>
              Signup
            </Button>
          )}
        </div>
        <ul
          className={styels["errors-ul"]}
          style={{
            height:
              enterdEmailHasError || enterdPasswordHasError ? "160px" : "auto",
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
          {enterdConfirmingPasswordHasError &&
            passwordConfirmingTestCases.map((item) => (
              <PopupError key={item.testCase} message={item.testCase} />
            ))}
        </ul>
      </form>
      <p className={styels["form-action-footer"]}>
        Have an account?{" "}
        <Link id="nav-page-login" to="/login">
          Login
        </Link>
      </p>
    </main>
  );
};

export default Signup;
