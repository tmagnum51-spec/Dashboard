import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Error from "./pages/errors";
import Home from "./pages/home";
import Login from "./pages/Login";
function App(){
  return (
    <Router>
      <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

        

      </Routes>
      
    </Router>
  )
}
export default App
