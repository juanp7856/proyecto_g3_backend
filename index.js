const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")



const PORT = process.env.PORT || 4444

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(cors())

app.listen(PORT, () => {
    console.log(`Servidor web iniciado en puerto ${PUERTO}`)
})