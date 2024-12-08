import { useState } from "react";

const useInput = (testCases) => {
  const [enterdValue, setEnterdValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const runTestCases = (value, testCases) => {
    const results = [];

    for (const testCase in testCases) {
      if (testCases.hasOwnProperty(testCase)) {
        const testFunction = testCases[testCase];
        const actual = testFunction(value);
        if (!actual) {
          results.push({ testCase, value: actual });
        }
      }
    }

    return results;
  };

  const areAllTrue = (results) => {
    for (const testCase of results) {
      if (!testCase.value) {
        return false; // Found a false test case, return false
      }
    }
    return true; // All test cases are true
  };

  const allTestCases = runTestCases(enterdValue, testCases);
  const enterdValueIsValid = areAllTrue(allTestCases);
  const hasError = !enterdValueIsValid && isTouched; // if the field is not valid and blured

  const valueChangeHandler = (event) => {
    setEnterdValue(event.target.value.trim());
    setIsTouched(false); // to make the input lose focus
  };

  const valueBlurHandler = () => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnterdValue("");
    setIsTouched(false);
  };

  return {
    value: enterdValue,
    isValid: enterdValueIsValid,
    testCases: allTestCases,
    hasError,
    valueChangeHandler,
    valueBlurHandler,
    reset,
  };
};

export default useInput;
