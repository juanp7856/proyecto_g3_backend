const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { v4: uuidv4 } = require('uuid')

const {Orden,Orden_Producto,PC_Armado,PC_Armado_Producto,Producto,Reporte,Resena,Usuario } = require("./dao")


const PORT = process.env.PORT || 4444

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(cors())

app.get("/register", async (req, res) => {
    const uuid = uuidv4()
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const correo = req.body.correo
    const password = req.body.password
    
    const nuevoUser = await Usuario.create({
        id : uuid,
        nombre : nombre,
        apellido : apellido,
        correo: correo,
        contrasena : password
    })
    
    res.send({
        "id" : nuevoUser.id,
        "nombre" : nuevoUser.nombre,
        "apellido" : nuevoUser.apellido,
    })
})

app.get("/login", async (req, res) => {
    const correo = req.query.correo
    const password = req.query.password

    const loggedUsuario = await Usuario.findAll({
        where: {
            contrasena : password,
            correo : correo
        }
    })

    res.send(loggedUsuario)
    // res.send({
    //     "id" : loggedUsuario.id,
    //     "nombre" : loggedUsuario.nombre,
    //     "apellido" : loggedUsuario.apellido,
    //     "direccion" : loggedUsuario.direccion,
    //     "departamento" : loggedUsuario.departamento,
    //     "ciudad" : loggedUsuario.ciudad,
    //     "codigo_postal" : loggedUsuario.codigo_postal,
    //     "telefono" : loggedUsuario.telefono
    // })
})

app.get("/infoproducto/:id", async (req, res) => {
    const uuid  = req.params.id
    const producto = Producto.findAll({
        where : {
            id : uuid
        }
    })
    res.send(producto)
})

app.get("/productos", async (req, res) => {
    const productos = await Producto.findAll()
    res.send(productos)
})

app.get("/orden/:id", async (req, res) => {
    const uuid = req.params.id
    const ordenProductos = await Orden_Producto.findOne({
        where : {
            id : uuid
        },
        include : Producto
    })
    res.send(ordenProductos)
})

app.get("/orden/generar", async (req, res) => {
    const uuid = uuidv4()
    const uuid2 = uuidv4()
    const usuario = req.body.uId
    const monto = req.body.monto
    const direc = req.body.direc
    const productos = req.body.productos

    await Orden.create({
        id : uuid,
        monto : monto,
        usuario_id : usuario,
        direccion : direc,
        fecha : new Date().toJSON(),
    })

    for (let i = 0; i < productos.length; i++) {
        await Orden_Producto.create({
            id : uuid2,
            orden_id : uuid,
            producto_id : productos[i].id
        })
    }
})

app.get("/resena/crear", async (req, res) => {
    const uuid = uuidv4()
    const usuario = req.body.uId
    const puntaje = req.body.puntaje
    const comentario = req.body.comentario
    const tipo_resena = req.body.tipo_resena

    await Resena.create({
        id : uuid,
        usuario_id : usuario,
        puntaje : puntaje,
        comentario : comentario,
        tipo_resena : tipo_resena
    })
})

app.get("/resenas", async (req, res) => {
    const resenas = await Resena.findAll()
    res.send(resenas)
})

app.get("/build/:id", async (req, res) => {
    const uuid = req.params.id
    const productos = await PC_Armado_Producto.findOne({
        where : {
            id : uuid
        },
        include : Producto
    })
    res.send(productos)
})

app.listen(PORT, () => {
    console.log(`Servidor web iniciado en puerto ${PUERTO}`)
})