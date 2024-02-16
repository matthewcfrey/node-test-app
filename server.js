// make use of the http module
const http = require('http')
const url = require("url")
const path = require("path")
const fs = require("fs")

// configure HTTP server to respond with simple message to all requests
const server = http.createServer((request, response) => {
	//get filename from url
	let requestedFile = url.parse(request.url).pathname;
	//get correct path by combining cwd with file path with url
	let filename = path.join(process.cwd(), "public/images", requestedFile)

	//console.log(filename)

	fs.access(filename, fs.constants.F_OK, err => {
		if(err) {
			console.log(err.message)
			response.writeHead(404, {"Content-Type": "text/html"})
			response.write("<h1>404 Error</h1>\n")
			response.write(err.message)
			response.end()
			return;
		}

		//now handle if exists - send to client
		fs.readFile(filename, "binary", (err, file) => {
			if(err) {
				response.writeHead(500, {"Content-Type": "text/html"})
				response.write("<h1>500 Error</h1>\n")
				response.write(err + "\n")
				response.end()
				return
			}
			response.writeHead(200)
			response.write(file, "binary")
			response.end()
		})
	})

});

// Listen on port 8080 on localhost
const port = process.env.PORT || 8080;
server.listen(port);

// display a message on the terminal
console.log("Server running at port=" + port);
