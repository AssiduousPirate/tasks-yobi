const express = require("express")
const mysql = require("mysql")
const cors = require("cors")
const bodyParser = require("body-parser")
const cron = require("node-cron")
const request = require("request")
const PORT = 3222
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

const validateUrl = (req, res, next) => {
	const { url } = req.body
	let regexpression = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
	let urlValidation = regexpression.test(url)
	if (urlValidation !== true) {
		return res.status(500).json("Invalid url")
	} else {
		next()
	}
}

app.post("/api/for/inserting/url", validateUrl, async (req, res) => {
	try {
		const { url, status } = req.body
		const query = (`SELECT * FROM websites WHERE url = ?`)
		connection.query(query, [url], (err, response) => {
			if(err) throw err
			if(response.length) {
				return res.status(200).json("URL already exists")
			} else {
				const insertQuery = (`INSERT INTO websites (url, status) VALUES ?`)
				const values = [[url, status]]
				connection.query(insertQuery, [values])
				return res.status(200).json("Website created successfully!")
			}
		})
	} catch (err) {
		return res.status(500).json("An error occurred: " + err)
	}
})

app.get("/api/for/retriving/urls", async (req, res) => {
	try {
		const query = (`SELECT * FROM websites`)
		connection.query(query, (err, data) => {
			if(err) throw err
			return res.status(200).json(data)
		})
	} catch (err) {
		return res.status(500).json("An error occurred: " + err)
	}
})

cron.schedule('*/2 * * * *', async () => {
	const query = (`SELECT * FROM websites`)
	connection.query(query, (err, data) => {
		if(err) throw err
		if(data.length) {
			data.map((items, index) => {
				let url = items.url
				request(url, (err, response) => {
					if(!err && response.statusCode === 200){
						const updateqry = (`UPDATE websites SET status = ? WHERE url = ?`)
						connection.query(updateqry, ['success', url], (err) => {
							if(err) throw err
							console.log("Website status updated to success")
						})
					} else {
						const updateqry = (`UPDATE websites SET status = ? WHERE url = ?`)
						connection.query(updateqry, ['failure', url], (err) => {
							if(err) throw err
							console.log("Website status updated to failure")
						})
					}
				})
			})
		} else {
			console.log("There is no website on database")
		}
	})
})

app.listen(PORT, (err) => {
    if (err) console.log("An error accured!")
    console.log(`Server has started on ${PORT}`)
})