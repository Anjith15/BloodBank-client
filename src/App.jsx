import "./App.css"
import { AuthProvider } from "./contexts/AuthContext"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./components/Home"
import Register from "./components/Register"
import RootLayout from "./components/RootLayout"
import Login from "./components/Login"
import Donate from "./components/Donate"
import Request from "./components/Request"
import MyDonations from "./components/MyDonations"

function App() {
  const browserRouterObj = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "donate",
          element: <Donate />,
        },
        {
          path: "request",
          element: <Request />,
        },
        {
          path: "my-donations",
          element: <MyDonations />,
        },
      ],
    },
  ])

  return (
    <AuthProvider>
      <RouterProvider router={browserRouterObj} />
    </AuthProvider>
  )
}

export default App
