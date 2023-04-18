import react from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Tables from "./Components/Tables"
import Home from "./Components/Home"
class App extends react.Component{
    render(){
        return(
            <>
                <Router>
                    <Routes>
                        <Route path={"/"} element={ <Home /> }></Route>
                        <Route path={"/tables"} element={ <Tables /> }></Route>
                    </Routes>
                </Router>
            </>
        )
    }
}

export default App