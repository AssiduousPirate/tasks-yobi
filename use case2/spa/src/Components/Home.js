import react from "react"
import { Link } from "react-router-dom"
import DataService from "../Services/sevices"
class Home extends react.Component {
    constructor(props){
        super(props)

        this.state = {
            url: "",

            data: []
        }
        this.handleUrlChange = this.handleUrlChange.bind(this)
        this.handleUrlSubmit = this.handleUrlSubmit.bind(this)
    }

    handleUrlChange(event) {
        this.setState({
            url: event.target.value
        })
    }

    handleUrlSubmit(event) {
        event.preventDefault()

        let body = {
            url: this.state.url,
            status: "success"
        }
        
        DataService.CreateUrl(body)
            .then((response) => {
                this.setState({
                    url: ""
                })
                window.location.reload()
            })
            .catch((error) => {
                alert("There is some Error" + ": " + error)
            })
    }

    componentDidMount() {
        DataService.GetUrls()
        .then((response) => {
            this.setState({
                data: response.data
            })
        })
        .catch((error) => {
            alert("There is some Error" + ": " + error)
        })
    }
    render(){
        const { data, url } = this.state
        return(
            <>
                <div className="container">
                    <form className="form" onSubmit={this.handleUrlSubmit}>
                        <input className="input" value={url} onChange={this.handleUrlChange} type="url" placeholder="Enter Website to be monitored" />
                        <button type="submit" className="add">Add</button>
                    </form>

                    <div className="data">
                        <table className="table">
                            <thead className="thead">
                                <th>Website</th>
                                <th>Status</th>
                            </thead>
                            <tbody className="tbody">
                                {data?.map(items => (
                                    <tr>
                                        <td key={items.id}><Link to={items.url}>{items.url}</Link></td>
                                        <td><button className={items.status == 'success' ? "green-btn" : "red-btn"}>{items.status}</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        )
    }
}

export default Home