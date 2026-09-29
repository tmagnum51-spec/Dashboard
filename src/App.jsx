import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Error from "./pages/errors";
import Home from "./pages/home";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Header from "./components/header";
import Profile from "./pages/Profile";
function App(){
  return (
    <Router>
      
      <Routes>
      {/* Routes protégées (nécessitent d'être connecté) */}
      <Route element={<ProtectedRoute />}>
      
      <Route path="/profile" element={<Profile />} />
      
      <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      {/* Routes publiques */}
      <Route path="/" element={<Login />} />
     

      {/* Route 404 */}
      <Route path="*" element={<Error />} />


        

      </Routes>
      
    </Router>
  )
}
export default App
