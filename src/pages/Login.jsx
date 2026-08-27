import Counter from "../components/counter"
import Footer from "../components/Footer"
import Header from "../components/header"

function Login(){
    return(
      <>
        <Header />
          <h1>
            Login
        </h1>
        <p>
            <Counter />
        </p>    
        <Footer />
      </>
    )
}
export default Login