import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/SignLayout/Layout"
import SignIn from "./components/SignLayout/SignIn"
import SignUp from "./components/SignLayout/SignUp"
import AllBooks from "./components/BookLayout/AllBooks"
import Registration from "./components/BookLayout/Registration"
import Edit from "./components/BookLayout/Edit"
import Delete from "./components/BookLayout/Delete"
import Logout from "./components/Logout"
import { useContext } from "react"
import { AuthContext } from "./contexts/AuthContext"


function App() {
  const { isLoggedIn } = useContext(AuthContext)
  console.log(isLoggedIn);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<SignIn />} />
            <Route path="/signin" index element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          {isLoggedIn ? (<>
            <Route path="/books" element={<AllBooks />} >
              <Route path="new" element={<Registration />} />
              <Route path="books/edit" element={<Edit />} />
              <Route path="books/delete" element={<Delete />} />
            </Route>
            <Route path="/logout" element={<Logout />} />

          </>) :
            <Route path="/books/*" element={<Navigate to="/signin" replace />} />
          }
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
