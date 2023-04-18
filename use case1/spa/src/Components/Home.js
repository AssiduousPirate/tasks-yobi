import react from "react"
import DataService from "../Services/sevices"
import { withRouter } from "../Common/with-router"
class Home extends react.Component{
    constructor(props){
        super(props)
        this.state = {
            tableName: "",
            columnName: "",
            cityName: "",
        }
        this.handletableNameChange = this.handletableNameChange.bind(this)
        this.handlecolumnNameChange = this.handlecolumnNameChange.bind(this)
        this.handlecityNameChange = this.handlecityNameChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handletableNameChange(event) {
        this.setState({
            tableName: event.target.value
        })
    }
    handlecolumnNameChange(event) {
        this.setState({
            columnName: event.target.value
        })
    }
    handlecityNameChange(event) {
        this.setState({
            cityName: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        let body = {
            'tableName': this.state.tableName,
            'columnName': this.state.columnName,
            'cityName': this.state.cityName,
        }
        DataService.CreateTable(body)
            .then((response) => {
                this.setState({
                    tableName: "",
                    columnName: "",
                    cityName: "",
                })
                this.props.router.navigate("/tables")
				window.location.reload()
            })
            .catch((error) => {
                alert("There is some Error" + ": " + error)
            })
    }
    render(){
        const { columnName, cityName, tableName } = this.state
        return(
            <>
                <div className="home-container">
                    <form className="form" onSubmit={this.handleSubmit}>
                        <input type="text" value={tableName} onChange={this.handletableNameChange} required placeholder="Table Name" />
                        <input type="text" value={cityName} onChange={this.handlecityNameChange} required placeholder="Unique Column" />
                        <input type="text" value={columnName} onChange={this.handlecolumnNameChange} required placeholder="Column Name" />
                        <button type="submit">Manual Update</button>
                    </form>
                </div>
            </>
        )
    }
}

export default withRouter(Home)