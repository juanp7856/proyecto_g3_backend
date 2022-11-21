const { Sequelize, DataTypes } = require("sequelize");

const CADENA_CONEXION = process.env.DATABASE_URL

const sequelize = new Sequelize(CADENA_CONEXION)



const Reporte = sequelize.define("reporte", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    usuario_id : {
        type : DataTypes.UUID,
        allowNull : false
    },
    correo : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    nombre : {
        type : DataTypes.STRING(70),
        allowNull : false
    },
    telefono : {
        type : DataTypes.STRING(15),
        allowNull : false
    },
    asunto : {
        type : DataTypes.string(50),
        allowNull : false
    },
    descripcion : {
        type : DataTypes.string(500),
        allowNull : false
    }
}, {
    timestamps : false,
    freezeTableName : true
})

const Usuario = sequelize.define("usuario", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    nombre : {
        type : DataTypes.STRING(70),
        allowNull : false
    },
    apellido : {
        type : DataTypes.STRING(70),
        allowNull : false
    },
    correo : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    contrasena : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    direccion : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    departamento : {
        type : DataTypes.string(30),
        allowNull : false
    },
    ciudad : {
        type : DataTypes.string(30),
        allowNull : false
    },
    codigo_postal : {
        type : DataTypes.string(15),
        allowNull : false
    },
    telefono : {
        type : DataTypes.string(15),
        allowNull : false
    }
}, {
    timestamps : false,
    freezeTableName : true
})

const Resena = sequelize.define("resena", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    usuario_id : {
        type : DataTypes.UUID,
        allowNull : false
    },
    puntaje : {
        type : DataTypes.STRING(20),
        allowNull : false
    },
    comentario : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    video_solo_influencer : {
        type : DataTypes.string(200),
        allowNull : true
    },
    link_solo_influencer : {
        type : DataTypes.string(300),
        allowNull : true
    },
    tipo_resena : {
        type : DataTypes.string(50),
        allowNull : false
    }
}, {
    timestamps : false,
    freezeTableName : true
})

const Orden = sequelize.define("orden", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    usuario_id : {
        type : DataTypes.UUID,
        allowNull : false
    },
    monto : {
        type : DataTypes.STRING(10),
        allowNull : false
    },
    direccion : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    fecha : {
        type : DataTypes.DATEONLY,
        allowNull : true
    }
}, {
    timestamps : false,
    freezeTableName : true
})

const Orden_Producto = sequelize.define("orden_producto", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    orden_id : {
        type : DataTypes.UUID,
        allowNull : false
    },
    producto_id : {
        type : DataTypes.UUID,
        allowNull : false
    }
}, {
    timestamps : false,
    freezeTableName : true
})

const Producto = sequelize.define("producto", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    nombre : {
        type : DataTypes.STRING(100),
        allowNull : false
    },
    precio : {
        type : DataTypes.STRING(25),
        allowNull : false
    },
    descripcion : {
        type : DataTypes.STRING(150),
        allowNull : false
    },
    categoria : {
        type : DataTypes.STRING(50),
        allowNull : false
    }
}, {
    timestamps : false,
    freezeTableName : true
})

const PC_Armado_Producto = sequelize.define("pc_armado_producto", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    pcarmado_id : {
        type : DataTypes.UUID,
        allowNull : false
    },
    producto_id : {
        type : DataTypes.UUID,
        allowNull : false
    }
}, {
    timestamps : false,
    freezeTableName : true
})

const PC_Armado = sequelize.define("pc_armado", {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : Sequelize.UUIDV4
    },
    nombre : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    descripcion : {
        type : DataTypes.STRING(150),
        allowNull : false
    }
}, {
    timestamps : false,
    freezeTableName : true
})


//RELACIONES DE TABLAS

//REPORTE * <-> 1 USUARIO
Reporte.belongsTo(Usuario, {
    foreignKey : "usuario_id"
})
Usuario.hasMany(Reporte,{
    foreignKey : "id"
})

//RESEÑA * <-> 1 USUARIO
Resena.belongsTo(Usuario,{
    foreignKey : "usuario_id"
})
Usuario.hasMany(Resena,{
    foreignKey : "id"
})

//ORDEN * <-> 1 USUARIO
Orden.belongsTo(Usuario,{
    foreignKey : "usuario_id"
})
Usuario.hasMany(Orden,{
    foreignKey : "id"
})

//ORDEN_PRODUCTO * <-> 1 ORDEN
Orden_Producto.belongsTo(Orden,{
    foreignKey : "orden_id"
})
Orden.belongsTo(Orden_Producto,{
    foreignKey : "id"
})

//ORDEN_PRODUCTO * <-> 1 PRODUCTO
Orden_Producto.belongsTo(Producto,{
    foreignKey : "producto_id"
})
Producto.belongsTo(Orden_Producto,{
    foreignKey : "id"
})

//PC_ARMADO_PRODUCTO * <-> 1 PRODUCTO
PC_Armado_Producto.belongsTo(Producto,{
    foreignKey : "producto_id"
})
Producto.belongsTo(PC_Armado_Producto,{
    foreignKey : "id"
})

//PC_ARMADO_PRODUCTO * <-> 1 PC_ARMADO
PC_Armado_Producto.belongsTo(PC_Armado,{
    foreignKey : "pcarmado_id"
})
PC_Armado.hasMany(PC_Armado_Producto,{
    foreignKey : "id"
})

module.exports = {
    Reporte,
    Usuario,
    Resena,
    Orden,
    Orden_Producto,
    Producto,
    PC_Armado_Producto,
    PC_Armado
}