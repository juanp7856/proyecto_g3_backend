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

//TERMINADO
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

//TERMINADO
app.post("/login", async (req, res) => {
    const correo = req.body.correo
    const contrasena = req.body.contrasena

    const loggedUsuario = await Usuario.findOne({
        where: {
            correo : correo,
            contrasena : contrasena
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
    
})

//TERMINADO
app.get("/datos", async (req, res) => {
    const uuid = req.query.id
    const userdata = await Usuario.findOne({
        where : {
            id : uuid
        }
    })
    res.send({
        "id" : userdata.id,
        "nombre" : userdata.nombre,
        "apellido" : userdata.apellido,
        "direccion" : userdata.direccion,
        "departamento" : userdata.departamento,
        "ciudad" : userdata.ciudad,
        "codigo_postal" : userdata.codigo_postal,
        "telefono" : userdata.telefono
    })
})

//TERMINADO
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

//TERMINADO
app.get("/infoproducto", async (req, res) => {
    const uuid  = req.query.id
    const producto = await Producto.findOne({
        where : {
            id : uuid
        }
    })
    res.send({
        "id" : producto.id,
        "nombre" : producto.nombre,
        "precio" : producto.precio,
        "descripcion" : producto.descripcion,
        "categoria" : producto.categoria
    })
})

//TERMINADO
app.get("/productos", async (req, res) => {
    const productos = await Producto.findAll()
    res.send(productos)
})

//TERMINADO
app.get("/orden/productos", async (req, res) => {
    const uuid = req.query.id
    const ordenes = await Orden.findAll({
        where : {
            usuario_id : uuid
        }
    })
    let listaProductos = []

    for (let i = 0; i < ordenes.length; i++) {
        const ordenesProducto = await Orden_Producto.findAll({
            where : {
                orden_id : ordenes[i].id
            }
        })
        for (let j = 0; j < ordenesProducto.length; j++) {
            const producto = await Producto.findOne({
                where : {
                    id : ordenesProducto[j].producto_id
                }
            })
            listaProductos.push(producto)
        }
    }
    res.json(listaProductos)

})

//TERMINADO
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

//FALTA REVISAR
app.post("/resena/crear", async (req, res) => {
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

//FALTA REVISAR
app.get("/resenas", async (req, res) => {
    const usuarios = await Usuario.findAll()
    
    let listaResenas = []

    for (let i = 0; i < usuarios.length; i++) {
        const resenas = await Resena.findAll({
            where : {
                usuario_id : usuarios[i].id
            }
        })
        listaResenas.push(resenas)
    }
})

//FALTA TERMINAR
app.get("/build", async (req, res) => {
    const uuid = req.params.id
    const productos = await PC_Armado_Producto.findOne({
        where : {
            id : uuid
        }
    })
    res.send(productos)
})

//TERMINADO
app.post("/reporte/generar", async (req, res) => {
    const uuid = req.body.id
    const correo = req.body.correo
    const nombre = req.body.nombre
    const telefono = req.body.telefono
    const asunto = req.body.asunto
    const descripcion = req.body.descripcion

    await Reporte.create({
        correo : correo,
        nobmre : nombre,
        telefono : telefono,
        asunto : asunto,
        descripcion : descripcion,
        usuario_id : uuid
    })
})

app.listen(PORT, () => {
    console.log(`Servidor web iniciado en puerto ${PORT}`)
})