import "./App.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Home from "./Components/Home";
import Paste from "./Components/Paste";
import ViewPaste from "./Components/ViewPaste";
import Login from "./Components/login";
import Signup from "./Components/Signup";
import Login_signup from "./Components/login_signup";
import Profile from "./Components/Profile";

function ProtectedRoute(props) {
  if (!props.token) {
    return <Navigate to="/"/>
  }
  return props.children;
}

function App() {
  let token = localStorage.getItem("token");

  const router = createBrowserRouter([
    {
      path: "/",
      element: token ? <Navigate to="/home"/> : (
        <div>
          <Login_signup />
          <Login />
        </div>
      ),
    },

    {
      path: "/signup",
      element: token ? <Navigate to="/home"/> : (
        <div>
          <Login_signup />
          <Signup />
        </div>
      ),
    },

    {
      path: "/home",
      element: (
        <ProtectedRoute token={token}>
          <NavBar />
          <Home />
        </ProtectedRoute>
      ),
    },

    {
      path: "/pastes",
      element: (
        <ProtectedRoute token={token}>
          <NavBar />
          <Paste />
        </ProtectedRoute>
      ),
    },

    {
      path: "/home/pastes/:id",
      element: (
        <ProtectedRoute token={token}>
          <NavBar />
          <ViewPaste />
        </ProtectedRoute>
      ),
    },

    {
      path: "/profile",
      element: (
        <ProtectedRoute token={token}>    
          <NavBar />
          <Profile />
        </ProtectedRoute>
      ),
    },

    {
      path: "*",
      element: (
        <div>
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
            }}
          >
            This Page does not Exist
          </h1>
        </div>
      ),
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;