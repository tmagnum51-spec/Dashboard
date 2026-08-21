import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Error from "./pages/errors";
import Home from "./pages/home";
function App(){
  return (
    <Router>
      <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<Home />} />

        

      </Routes>
      
    </Router>
  )
}
export default App
