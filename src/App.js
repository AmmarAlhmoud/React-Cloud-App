import { RouterProvider, createBrowserRouter } from "react-router-dom";

import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import CloudPage from "./pages/Cloud";
import Documents from "./components/CL-Pages/NavigationItems/Documents";
import Images from "./components/CL-Pages/NavigationItems/Images";
import Videos from "./components/CL-Pages/NavigationItems/Videos";
import VideoViewerPage from "./pages/VideoViewer";
// import ErrorPage from "./pages/Error";
import ProtectedRouteNoUser from "./pages/ProtectedRouteNoUser";
import ProtectedRouteWithUser from "./pages/ProtectedRouteWithUser";

const router = createBrowserRouter([
  // { path: "/", element: <HomePage />, errorElement: <ErrorPage /> },
  { path: "/", element: <HomePage /> },
  {
    path: "login",
    element: (
      <ProtectedRouteNoUser>
        <LoginPage />
      </ProtectedRouteNoUser>
    ),
  },
  {
    path: "signup",
    element: (
      <ProtectedRouteNoUser>
        <SignupPage />
      </ProtectedRouteNoUser>
    ),
  },
  {
    path: "cloud",
    element: (
      <ProtectedRouteWithUser>
        <CloudPage />
      </ProtectedRouteWithUser>
    ),
    children: [
      { path: "documents", element: <Documents /> },
      { path: "Images", element: <Images /> },
      { path: "Videos", element: <Videos /> },
    ],
  },
  {
    path: "cloud/Videos/:videoId",
    element: (
      <ProtectedRouteWithUser>
        <VideoViewerPage />
      </ProtectedRouteWithUser>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
