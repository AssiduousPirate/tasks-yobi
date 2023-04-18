import React from "react";
import DataService from "../Services/sevices";

class Tables extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };

        this.handleColumnNameChange = this.handleColumnNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleColumnNameChange(event, id) {
        const { data } = this.state;
        const index = data.findIndex((item) => item.id === id);
        const newData = [...data];
        newData[index] = {
            ...newData[index],
            column_name: event.target.value,
        };
        this.setState({
            data: newData,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const { data } = this.state;
        const updatePromises = data.map((item) => {
        return DataService.UpdateTable(item.id, { columnName: item.column_name })})
        Promise.all(updatePromises)
        .then(() => {
            this.setState({
                data: data.map((item) => {
                    return {
                        ...item,
                        column_name: "",
                    }
                }),
            })
            window.location.reload()
        })
        .catch((error) => {
            alert("There is some Error" + ": " + error)
        })
    }

    componentDidMount() {
        DataService.GetTables()
        .then((response) => {
            this.setState({
                data: response.data,
            })
        })
        .catch((error) => {
            alert("There is some Error" + ": " + error)
        })
    }

    render() {
        const { data } = this.state;
        return (
        <>
            <div className="table-container">
                <form onSubmit={this.handleSubmit}>
                    <table>
                        <thead>
                            <tr>
                                <th>Table Name</th>
                                <th>Column Name</th>
                                <th>Distinct Value</th>
                                <th>Input Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.table_name}</td>
                                    <td>{item.column_name}</td>
                                    <td>{item.city_name}</td>
                                    <td>
                                        <input className="column_name" value={item.column_name || ""} onChange={(event) => this.handleColumnNameChange(event, item.id)} type="text" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="submit" className="update">Update</button>
                </form>
            </div>
        </>
        )
    }
}

export default Tables
