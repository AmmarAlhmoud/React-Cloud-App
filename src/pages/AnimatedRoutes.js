import { Routes, Route, useLocation } from "react-router-dom";

import LoginPage from "./Login";
import SignupPage from "./Signup";

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route index element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};

export default AnimatedRoutes;
