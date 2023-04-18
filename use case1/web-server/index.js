const express = require("express")
const mysql = require("mysql")
const cors = require("cors")
const bodyParser = require("body-parser")
const PORT = 3111
const app = express()
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use(cors({
	origin: "*"
}))

app.use(function(req, res, next){
	res.setHeader("Access-Control-Allow-Origin", "*")
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Request-With, Content-Type, Accept, Authorization"
	)
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, PATCH, DELETE, OPTIONS"
	)
	res.setHeader("Access-Control-Allow-Credentials", true)
	if (res.method == "OPTIONS") {
		return res.status("204").send("OK")
	}
	next()
})

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'interview'
})
  
connection.connect((err) => {
    if (err) throw err
    console.log('Connected to MySQL database!')
})

const Tables = (req, res, next) => {
	const { tableName, columnName, cityName } = req.body
	if (!tableName || !cityName || !columnName || tableName === "" || cityName === "" || columnName === "") {
	    res.status(500).json("Any value should not be empty or null")
	} else {
	    return next()
	}
}
  

const UpdateTable = (req, res, next) => {
	const { columnName } = req.body
	if (!columnName || columnName === "") {
	    res.status(500).json("Any value should not be empty or null")
	} else {
	    return next()
	}
}

app.post("/api/for/creating/table", Tables, async (req, res) => {
	try {
		const { tableName, columnName, cityName } = req.body
		const insertQuery = `INSERT INTO geography_columns (table_name, column_name, city_name) VALUES ('${tableName}', '${columnName}', '${cityName}')`;
		await connection.query(insertQuery)
		return res.status(200).json("Table inserted successfully!")
	} catch (err) {
	    return res.status(500).json("An error occurred: " + err)
	}
})

app.get("/api/for/tables", async (req, res) => {
	try {
		const query = `SELECT * FROM geography_columns`
		await connection.query(query, (err, items) => {
			if(err) throw err
			return res.status(200).json(items)
		})
	} catch (err) {
		return res.status(500).json({ error: "An error occurred while fetching the data." })
	}
})

app.put("/api/for/updating/table/:id", UpdateTable, async (req, res) => {
	try {
		const { id } = req.params
		const { columnName } = req.body
		const updateQuery = "UPDATE geography_columns SET column_name = ? WHERE id = ?"
		await connection.query(updateQuery, [columnName, id])
		const query = `SELECT * FROM geography_columns`
		await connection.query(query, (err, items) => {
			if(err) throw err
			return res.status(200).json(items)
		})
	} catch (err) {
		console.log(err)
		return res.status(500).json({ error: "An error occurred while updating the table." })
	}
})

app.listen(PORT, (err) => {
    if (err) console.log("An error accured!")
    console.log(`Server has started on ${PORT}`)
})