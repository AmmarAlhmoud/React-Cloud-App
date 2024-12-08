import { Navigate } from "react-router-dom";
import { getAuthUserId } from "../util/auth";

const ProtectedRouteNoUser = ({ children }) => {
  const userId = getAuthUserId();

  if (userId) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRouteNoUser;
