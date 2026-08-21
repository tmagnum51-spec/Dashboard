import { useState } from "react"

function Counter(){
    const [count, setCount] = useState(0)
    return (
        <>
        Vous avez cliqué {count} fois
        </>
    )
}
export default Counter