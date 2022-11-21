const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const {Orden,Orden_Producto,PC_Armado,PC_Armado_Producto,Producto,Reporte,Resena,Usuario } = require("./dao")


const PORT = process.env.PORT || 4444

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(cors())

app.get("/datos")


app.listen(PORT, () => {
    console.log(`Servidor web iniciado en puerto ${PUERTO}`)
})