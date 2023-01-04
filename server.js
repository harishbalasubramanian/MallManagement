const express = require('express')
const routes = require('./routes')
const app = express()

const port =5000
app.use(express.json())
// app.get('/',(req,res) => {
//     res.send('Hello World')
// })
app.use(routes)
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})