const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Tere, Maailm')
})
console.log("server on")

app.listen(8000)


// http://localhost:8000/