const express = require('express')
const app = new express()
const http = require('http').Server(app)
const port = 4000

// Init app
app.use(express.static('public'))

http.listen(port, () => {
    console.log('listen on port', port)
})