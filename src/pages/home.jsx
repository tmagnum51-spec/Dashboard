import DistanceChart from "../components/DistanceChart"
import Footer from "../components/Footer"
import Header from "../components/header"
import Dashboard from "./dashboard"

function Home(){
    return(
      <>
        
          <h1>
            Dashboard
        </h1>
        <div>
            <Dashboard />
        </div>    
        <Footer />
      </>
    )
}
export default Home