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

app.post("/register", async (req, res) => {
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const correo = req.body.correo
    const password = req.body.password
    
    const nuevoUser = await Usuario.create({
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

app.post("/login", async (req, res) => {
    const correo = req.query.correo
    const password = req.query.password

    try {
        const loggedUsuario = await Usuario.findOne({
            where: {
                contrasena : password,
                correo : correo
            }
        })

        res.send({
            "id" : loggedUsuario.id,
            "nombre" : loggedUsuario.nombre,
            "apellido" : loggedUsuario.apellido,
            "direccion" : loggedUsuario.direccion,
            "departamento" : loggedUsuario.departamento,
            "ciudad" : loggedUsuario.ciudad,
            "codigo_postal" : loggedUsuario.codigo_postal,
            "telefono" : loggedUsuario.telefono
        })
    } catch {
        res.send("error")
    }
    // res.send(loggedUsuario)
    
})

app.post("/actualizarDatos", async (req, res) => {
    const uuid = req.body.id
    const nombre = req.body.nombre
    const apellido = req.body.apellido
    const direccion = req.body.direccion
    const departamento = req.body.departamento
    const ciudad = req.body.ciudad
    const codigo_postal = req.body.codigo_postal
    const telefono = req.body.telefono

    try {
        await Usuario.update({
            nombre : nombre,
            apellido : apellido,
            direccion : direccion,
            departamento : departamento,
            ciudad : ciudad,
            codigo_postal : codigo_postal,
            telefono : telefono
        },
        {
            where : {
                id : uuid
            }
        })
    } catch {
        res.send("error actualizando datos")
    }
})

app.get("/infoproducto", async (req, res) => {
    const uuid  = req.query.id
    const producto = Producto.findOne({
        where : {
            id : uuid
        }
    })
    res.send({
        "id" : producto.id

    })
})

app.get("/productos", async (req, res) => {
    const productos = await Producto.findAll()
    res.send(productos)
})

app.get("/ordenProductos", async (req, res) => {
    const uuid = req.query.id
    const ordenes = await Orden.findAll({
        where : {
            id : uuid
        }
        // ,
        // include : [{
        //     model : Orden_Producto,
        //     include : [{
        //         model : Producto
        //     }]
        // }]
    })
    for (let i = 0; i < ordenes.length; i++) {
        const ordenesProducto = await Orden_Producto.findAll({
            where : {
                orden_id : ordenes[i].id
            }
        })
        for (let j = 0; j < ordenesProducto.length; j++) {
            const productos = await Producto.findOne({
                where : {
                    id : ordenesProducto[j].producto_id
                }
            })
        }
    }
    

    
})

app.post("/orden/generar", async (req, res) => {
    const usuario = req.body.uId
    const monto = req.body.monto
    const direc = req.body.direc
    const productos = req.body.productos

    const orden = await Orden.create({
        monto : monto,
        usuario_id : usuario,
        direccion : direc,
        fecha : new Date().toJSON(),
    })

    for (let i = 0; i < productos.length; i++) {  
        await Orden_Producto.create({
            orden_id : orden.id,
            producto_id : productos[i].id
        })
    }
})

app.get("/resena/crear", async (req, res) => {
    const usuario = req.body.uId
    const puntaje = req.body.puntaje
    const comentario = req.body.comentario
    const tipo_resena = req.body.tipo_resena

    await Resena.create({
        usuario_id : usuario,
        puntaje : puntaje,
        comentario : comentario,
        tipo_resena : tipo_resena
    })
})

//AÑADIR NOMBRE USUARIO
app.get("/resenas", async (req, res) => {
    const resenas = await Resena.findAll()
    res.send(resenas)
})

//CHECAR
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
    console.log(`Servidor web iniciado en puerto ${PORT}`)
})